namespace :imdb do
  desc "Generate ratings using Faker"
  task seed_ratings: :environment do
    require "faker"

    start_time = Time.now
    puts "Starting ratings generation at #{start_time}"

    # Get batch size from environment or default
    batch_size = ENV.fetch("BATCH_SIZE", 5000).to_i
    total_ratings = ENV.fetch("TOTAL_RATINGS", 100_000).to_i

    puts "Deleting existing ratings..."
    Rating.delete_all
    puts "All existing ratings cleared."

    # Get all available users and ratables
    puts "Building reference data..."
    user_ids = User.pluck(:id)
    movie_ids = Movie.pluck(:id)
    tv_show_ids = TvShow.pluck(:id)

    # Validation checks
    if user_ids.empty?
      puts "ERROR: No users found in database. Run rake db:seed_users first."
      exit 1
    end

    if movie_ids.empty? && tv_show_ids.empty?
      puts "ERROR: No movies or TV shows found. Please seed movies/TV shows first."
      exit 1
    end

    puts "Found #{user_ids.size} users, #{movie_ids.size} movies, #{tv_show_ids.size} TV shows"

    # Calculate ratings distribution (70% movies, 30% TV shows if both exist)
    total_ratables = movie_ids.size + tv_show_ids.size
    movie_rating_count = if movie_ids.empty?
        0
      elsif tv_show_ids.empty?
        total_ratings
      else
        (total_ratings * 0.7).to_i
      end
    tv_show_rating_count = total_ratings - movie_rating_count

    puts "Will generate #{movie_rating_count} movie ratings and #{tv_show_rating_count} TV show ratings"

    # Initialize counters
    ratings_created = 0
    batches_processed = 0

    # Create rating combinations to avoid duplicates
    puts "Preparing rating combinations..."
    rating_combinations = Set.new

    # Generate movie ratings
    movie_rating_count.times do
      user_id = user_ids.sample
      movie_id = movie_ids.sample
      combination = "#{user_id}-Movie-#{movie_id}"

      # Ensure uniqueness (user can only rate each item once)
      while rating_combinations.include?(combination)
        user_id = user_ids.sample
        movie_id = movie_ids.sample
        combination = "#{user_id}-Movie-#{movie_id}"
      end

      rating_combinations.add(combination)
    end

    # Generate TV show ratings
    tv_show_rating_count.times do
      user_id = user_ids.sample
      tv_show_id = tv_show_ids.sample
      combination = "#{user_id}-TvShow-#{tv_show_id}"

      # Ensure uniqueness
      while rating_combinations.include?(combination)
        user_id = user_ids.sample
        tv_show_id = tv_show_ids.sample
        combination = "#{user_id}-TvShow-#{tv_show_id}"
      end

      rating_combinations.add(combination)
    end

    puts "Generated #{rating_combinations.size} unique rating combinations"

    # Convert combinations to actual rating data
    puts "Starting to generate ratings in batches of #{batch_size}..."

    rating_combinations.each_slice(batch_size).with_index do |combination_batch, batch_index|
      puts "Processing batch #{batch_index + 1} (#{ratings_created}/#{total_ratings})..."

      ratings_batch = combination_batch.map do |combination|
        # Parse the combination string
        parts = combination.split("-")
        user_id = parts[0].to_i
        ratable_type = parts[1]
        ratable_id = parts[2].to_i

        # Generate score (weighted towards higher ratings)
        # 20% chance of 0-2, 30% chance of 2.5-3.5, 50% chance of 4-5
        score = case rand
          when 0..0.2
            [0, 0.5, 1.0, 1.5, 2.0].sample
          when 0.2..0.5
            [2.5, 3.0, 3.5].sample
          else
            [4.0, 4.5, 5.0].sample
          end

        # Generate review (70% chance)
        review = if rand < 0.7
            review_length = rand(20..355)
            Faker::Lorem.paragraph_by_chars(number: review_length)
          else
            nil
          end

        # Random timestamp in the past year
        created_at = Faker::Time.between(from: 1.year.ago, to: Time.current)

        {
          user_id: user_id,
          ratable_id: ratable_id,
          ratable_type: ratable_type,
          score: score,
          review: review,
          created_at: created_at,
          updated_at: created_at,
        }
      end

      # Insert the batch
      begin
        Rating.insert_all(ratings_batch)
        ratings_created += ratings_batch.size
        batches_processed += 1

        # Report progress
        percent_complete = ((ratings_created.to_f / total_ratings) * 100).round(2)
        puts "Progress: #{ratings_created}/#{total_ratings} ratings (#{percent_complete}%)"
      rescue => e
        puts "Error inserting batch: #{e.message}"
        puts "Continuing with next batch..."
      end
    end

    end_time = Time.now
    duration = (end_time - start_time).to_i

    puts "\n=== Ratings Generation Summary ==="
    puts "Completed in: #{duration} seconds"
    puts "Successfully generated: #{Rating.count} ratings"
    puts "Average speed: #{(Rating.count / duration.to_f).round(2)} ratings/second"
    puts "Movie ratings: #{Rating.where(ratable_type: "Movie").count}"
    puts "TV show ratings: #{Rating.where(ratable_type: "TvShow").count}"
    puts "Ratings with reviews: #{Rating.with_reviews.count}"
    puts "=== Generation Complete ==="
  end

  desc "Reset ratings table and restart ID sequence"
  task reset_ratings: :environment do
    puts "Deleting all ratings and resetting ID sequence..."

    adapter = ActiveRecord::Base.connection.adapter_name.downcase

    case adapter
    when "postgresql"
      ActiveRecord::Base.connection.execute("TRUNCATE ratings RESTART IDENTITY;")
    when "mysql", "mysql2"
      ActiveRecord::Base.connection.execute("TRUNCATE ratings;")
    when "sqlite"
      ActiveRecord::Base.connection.execute("DELETE FROM ratings;")
      ActiveRecord::Base.connection.execute("DELETE FROM sqlite_sequence WHERE name='ratings';")
    else
      puts "Unknown database adapter: #{adapter}"
      Rating.delete_all
    end

    puts "Ratings table reset successfully!"
  end
end
