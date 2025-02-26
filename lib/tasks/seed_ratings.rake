namespace :imdb do
  desc "Import ratings from CSV file"
  task import_ratings: :environment do
    require "csv"
    require "faker"

    start_time = Time.now
    puts "Starting ratings import at #{start_time}"

    batch_size = ENV.fetch("BATCH_SIZE", 5000).to_i
    ratings_file = Rails.root.join("db/data/ratings.csv")

    unless File.exist?(ratings_file)
      puts "Error: File not found: #{ratings_file}"
      exit 1
    end

    # Get the total number of ratings for progress reporting
    total_lines = `wc -l "#{ratings_file}"`.strip.split(" ")[0].to_i - 1 # Subtract 1 for header
    puts "Found #{total_lines} ratings to import"

    puts "Deleting existing ratings..."
    Rating.delete_all
    puts "All existing ratings cleared."

    # Build ID maps for faster lookups
    puts "Building reference maps..."
    user_id_map = User.pluck(:id).index_by(&:itself)

    # IMPORTANT: Changed the pluck fields - This is the key fix
    # Instead of using movie_id, we're now using the actual primary key 'id'
    movie_id_map = {}
    Movie.all.each do |movie|
      movie_id_map[movie.id.to_s] = movie.id
    end

    tv_show_id_map = TvShow.pluck(:id).index_by { |id| id.to_s }

    puts "Prepared mapping for #{user_id_map.size} users, #{movie_id_map.size} movies, and #{tv_show_id_map.size} TV shows"

    # Add debugging checks
    if user_id_map.empty?
      puts "ERROR: No users found in database. Please ensure User table is populated."
      exit 1
    end

    if movie_id_map.empty? && tv_show_id_map.empty?
      puts "ERROR: No movies or TV shows found in database. Please ensure Movie and TvShow tables are populated."
      exit 1
    end

    # Sample first few IDs to confirm mapping correctness
    puts "Sample user IDs in database: #{user_id_map.keys.first(5).join(", ")}"
    puts "Sample movie_ids in database: #{movie_id_map.keys.first(5).join(", ")}" unless movie_id_map.empty?
    puts "Sample show_ids in database: #{tv_show_id_map.keys.first(5).join(", ")}" unless tv_show_id_map.empty?

    # Get the first few rows from CSV to check what IDs we're expecting
    sample_rows = []
    CSV.foreach(ratings_file, headers: true).with_index do |row, index|
      sample_rows << row
      break if index >= 4  # Get first 5 rows
    end

    puts "First 5 rows from CSV:"
    sample_rows.each do |row|
      puts "  user_id: #{row["user_id"]}, movie_id: #{row["movie_id"]}, tv_show_id: #{row["tv_show_id"]}"
    end

    puts "Starting import in batches of #{batch_size}..."

    # Initialize counters
    processed = 0
    imported = 0
    skipped = 0
    batches = 0
    skipped_reasons = {
      missing_user: 0,
      missing_movie: 0,
      missing_tv_show: 0,
      no_media_id: 0,
    }

    ratings_batch = []

    CSV.foreach(ratings_file, headers: true) do |row|
      processed += 1

      user_id = row["user_id"].to_i
      user_db_id = user_id_map[user_id]

      # Debug skipped users
      if processed <= 100 && user_db_id.nil?
        puts "DEBUG: User ID #{user_id} not found in database"
      end

      # Determine if this is a movie or TV show rating
      ratable_db_id = nil
      ratable_type = nil

      if row["movie_id"].present? && !row["movie_id"].empty?
        ratable_type = "Movie"
        ratable_external_id = row["movie_id"]
        ratable_db_id = movie_id_map[ratable_external_id]

        # Debug skipped movies
        if processed <= 100 && ratable_db_id.nil?
          puts "DEBUG: Movie ID #{ratable_external_id} not found in map with keys: #{movie_id_map.keys.first(5)}..."
          skipped_reasons[:missing_movie] += 1
        end
      elsif row["tv_show_id"].present? && !row["tv_show_id"].empty?
        ratable_type = "TvShow"
        ratable_external_id = row["tv_show_id"]
        ratable_db_id = tv_show_id_map[ratable_external_id]

        # Debug skipped tv shows
        if processed <= 100 && ratable_db_id.nil?
          puts "DEBUG: TV Show ID #{ratable_external_id} not found in map with keys: #{tv_show_id_map.keys.first(5)}..."
          skipped_reasons[:missing_tv_show] += 1
        end
      else
        skipped += 1
        skipped_reasons[:no_media_id] += 1
        next
      end

      # Skip if we can't find the user or ratable item
      unless user_db_id
        skipped += 1
        skipped_reasons[:missing_user] += 1
        next
      end

      unless ratable_db_id
        skipped += 1
        next
      end

      # Convert rating to 0-5 scale if needed
      score = row["rating"].to_f

      # Normalize score to nearest 0.5 increment
      normalized_score = (score * 2).round / 2.0

      # Ensure score is within valid range
      normalized_score = [0, [5, normalized_score].min].max

      # Generate a fake review (randomly decide if there should be a review)
      review = nil
      if rand < 0.7 # 70% chance of having a review
        review_length = rand(20..355)  # Random length between 20 and 355 characters
        review = Faker::Lorem.paragraph_by_chars(number: review_length, supplemental: false)
      end

      # Get timestamp if available, otherwise use current time
      created_at = if row["timestamp"].present? && !row["timestamp"].empty?
          # Convert millisecond timestamp to Time object
          Time.at(row["timestamp"].to_i / 1000.0)
        else
          Time.current
        end

      ratings_batch << {
        user_id: user_db_id,
        ratable_id: ratable_db_id,
        ratable_type: ratable_type,
        score: normalized_score,
        review: review, # Randomly generated review
        created_at: created_at,
        updated_at: created_at,
      }

      # Insert batch when it reaches the specified size
      if ratings_batch.size >= batch_size
        begin
          Rating.insert_all(ratings_batch)
          imported += ratings_batch.size
          batches += 1

          # Report progress
          percent_complete = ((processed.to_f / total_lines) * 100).round(2)
          puts "Processed #{processed}/#{total_lines} (#{percent_complete}%), imported #{imported}, skipped #{skipped}, batch #{batches}"

          # Clear the batch array
          ratings_batch = []
        rescue => e
          puts "Error importing batch: #{e.message}"
          puts e.backtrace.join("\n")
          puts "Continuing with next batch..."
          ratings_batch = []
        end
      end

      # Report detailed skip reasons periodically
      if processed % 500000 == 0
        puts "Skip reason breakdown:"
        puts "  Missing users: #{skipped_reasons[:missing_user]}"
        puts "  Missing movies: #{skipped_reasons[:missing_movie]}"
        puts "  Missing TV shows: #{skipped_reasons[:missing_tv_show]}"
        puts "  No media ID: #{skipped_reasons[:no_media_id]}"
      end
    end

    # Insert any remaining ratings
    if ratings_batch.any?
      begin
        Rating.insert_all(ratings_batch)
        imported += ratings_batch.size
        batches += 1
      rescue => e
        puts "Error importing final batch: #{e.message}"
        skipped += ratings_batch.size
      end
    end

    end_time = Time.now
    duration = (end_time - start_time).to_i

    puts "\n=== Ratings Import Summary ==="
    puts "Completed in: #{duration} seconds"
    puts "Processed: #{processed} entries"
    puts "Successfully imported: #{imported} ratings"
    puts "Skipped: #{skipped} entries"
    puts "  - Missing users: #{skipped_reasons[:missing_user]}"
    puts "  - Missing movies: #{skipped_reasons[:missing_movie]}"
    puts "  - Missing TV shows: #{skipped_reasons[:missing_tv_show]}"
    puts "  - No media ID: #{skipped_reasons[:no_media_id]}"
    puts "Total batches: #{batches}"
    puts "=== Import Complete ==="
  end
end
