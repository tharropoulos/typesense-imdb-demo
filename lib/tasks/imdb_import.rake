namespace :imdb do
  desc "Import all IMDb data from CSV files into the database"
  task import: :environment do
    require "csv"
    batch_size = ENV.fetch("BATCH_SIZE", 1000).to_i
    start_time = Time.now

    puts "=== Starting IMDb data import ==="
    puts "Start time: #{start_time}"
    puts "Using batch size: #{batch_size}"

    puts "\nClearing existing data..."
    MovieGenre.delete_all
    MovieCast.delete_all
    MovieDirector.delete_all
    MovieCountry.delete_all
    TvShowCountry.delete_all
    Country.delete_all
    MovieWriter.delete_all
    TvShowGenre.delete_all
    TvShowCast.delete_all
    TvShowDirector.delete_all
    TvShowWriter.delete_all
    Movie.delete_all
    TvShow.delete_all
    Person.delete_all
    Genre.delete_all
    puts "All existing data cleared."

    # Import Genres
    puts "\nImporting genres..."
    genre_count = 0
    genre_data = []

    CSV.foreach(Rails.root.join("db/data/genres.csv"), headers: true) do |row|
      genre_data << {
        id: row["id"],
        name: row["name"],
        created_at: Time.current,
        updated_at: Time.current,
      }
      genre_count += 1
    end

    if genre_data.any?
      Genre.insert_all(genre_data)
      puts "Imported #{genre_count} genres."
    else
      puts "No genres found to import."
    end

    # Import countries
    puts "\nImporting countries..."
    country_count = 1
    country_data = []

    CSV.foreach(Rails.root.join("db/data/countries.csv"), headers: true) do |row|
      country_data << {
        id: country_count + 1,  # Use sequential numbering
        name: row["name"],
        created_at: Time.current,
        updated_at: Time.current,
      }
      country_count += 1
    end

    if country_data.any?
      Country.delete_all  # Clear existing countries
      Country.insert_all(country_data)
      puts "Imported #{country_count} countries."
    else
      puts "No countries found to import."
    end
    # Import People
    puts "\nImporting people..."
    total_people = 0
    people_batches = 0

    CSV.foreach(Rails.root.join("db/data/people.csv"), headers: true).each_slice(batch_size) do |batch|
      people_batch = batch.map do |row|
        {
          person_id: row["person_id"],
          full_name: row["full_name"],
          url: row["url"],
          created_at: Time.current,
          updated_at: Time.current,
        }
      end

      Person.insert_all(people_batch) if people_batch.any?
      total_people += people_batch.size
      people_batches += 1
      puts "Imported people batch #{people_batches} (#{total_people} total)"
    end
    puts "Completed importing #{total_people} people."

    # Import Movies
    puts "\nImporting movies..."
    total_movies = 0
    movie_batches = 0

    CSV.foreach(Rails.root.join("db/data/movies.csv"), headers: true).each_slice(batch_size) do |batch|
      movie_batch = batch.map do |row|
        {
          movie_id: row["movie_id"],
          title: row["title"],
          original_title: row["original_title"],
          release_year: row["release_year"],
          description: row["description"],
          content_rating: row["content_rating"],
          release_date: row["release_date"],
          runtime_minutes: row["runtime_minutes"],
          average_rating: row["average_rating"],
          num_votes: row["num_votes"],
          budget: row["budget"],
          gross_worldwide: row["gross_worldwide"],
          primary_image_url: row["primary_image_url"],
          created_at: Time.current,
          updated_at: Time.current,
        }
      end

      Movie.insert_all(movie_batch) if movie_batch.any?
      total_movies += movie_batch.size
      movie_batches += 1
      puts "Imported movies batch #{movie_batches} (#{total_movies} total)"
    end
    puts "Completed importing #{total_movies} movies."

    # Import TV Series
    puts "\nImporting TV series..."
    total_series = 0
    series_batches = 0

    CSV.foreach(Rails.root.join("db/data/tv_series.csv"), headers: true).each_slice(batch_size) do |batch|
      series_batch = batch.map do |row|
        {
          show_id: row["show_id"],
          title: row["title"],
          original_title: row["original_title"],
          start_year: row["start_year"],
          end_year: row["end_year"],
          description: row["description"],
          content_rating: row["content_rating"],
          average_rating: row["average_rating"],
          num_votes: row["num_votes"],
          total_seasons: row["total_seasons"],
          total_episodes: row["total_episodes"],
          primary_image_url: row["primary_image_url"],
          show_type: "series",
          created_at: Time.current,
          updated_at: Time.current,
        }
      end

      TvShow.insert_all(series_batch) if series_batch.any?
      total_series += series_batch.size
      series_batches += 1
      puts "Imported TV series batch #{series_batches} (#{total_series} total)"
    end
    puts "Completed importing #{total_series} TV series."

    # Import TV Miniseries
    puts "\nImporting TV miniseries..."
    total_miniseries = 0
    miniseries_batches = 0

    CSV.foreach(Rails.root.join("db/data/tv_miniseries.csv"), headers: true).each_slice(batch_size) do |batch|
      miniseries_batch = batch.map do |row|
        {
          show_id: row["show_id"],
          title: row["title"],
          original_title: row["original_title"],
          start_year: row["start_year"],
          end_year: row["end_year"],
          description: row["description"],
          content_rating: row["content_rating"],
          average_rating: row["average_rating"],
          num_votes: row["num_votes"],
          total_seasons: row["total_seasons"],
          total_episodes: row["total_episodes"],
          primary_image_url: row["primary_image_url"],
          show_type: "miniseries",
          created_at: Time.current,
          updated_at: Time.current,
        }
      end

      TvShow.insert_all(miniseries_batch) if miniseries_batch.any?
      total_miniseries += miniseries_batch.size
      miniseries_batches += 1
      puts "Imported TV miniseries batch #{miniseries_batches} (#{total_miniseries} total)"
    end
    puts "Completed importing #{total_miniseries} TV miniseries."

    # Cache IDs for faster lookups
    puts "\nBuilding reference maps for relationships..."

    # Build maps for movie relationships
    movie_id_map = Movie.pluck(:movie_id, :id).to_h
    puts "Built movie reference map with #{movie_id_map.size} entries"

    # Build maps for TV show relationships
    tv_show_id_map = TvShow.pluck(:show_id, :id).to_h
    puts "Built TV show reference map with #{tv_show_id_map.size} entries"

    # Build maps for person relationships
    person_id_map = Person.pluck(:person_id, :id).to_h
    puts "Built person reference map with #{person_id_map.size} entries"

    # Build maps for genre relationships
    genre_name_map = Genre.pluck(:name, :id).to_h
    puts "Built genre reference map with #{genre_name_map.size} entries"

    # Import Movie Genres
    puts "\nImporting movie genres..."
    total_movie_genres = 0
    mg_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/movie_genres.csv"), headers: true) do |row|
      movie_db_id = movie_id_map[row["movie_id"]]
      genre_db_id = genre_name_map[row["genre"]]

      if movie_db_id && genre_db_id
        batch_data << {
          movie_id: movie_db_id,
          genre_id: genre_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          MovieGenre.insert_all(batch_data)
          total_movie_genres += batch_data.size
          mg_batches += 1
          puts "Imported movie genres batch #{mg_batches} (#{total_movie_genres} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      MovieGenre.insert_all(batch_data)
      total_movie_genres += batch_data.size
      puts "Imported final movie genres batch (#{total_movie_genres} total)"
    end
    puts "Completed importing #{total_movie_genres} movie genres."

    # Import TV Show Genres
    puts "\nImporting TV show genres..."
    total_tv_genres = 0
    tg_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/tv_genres.csv"), headers: true) do |row|
      tv_db_id = tv_show_id_map[row["show_id"]]
      genre_db_id = genre_name_map[row["genre"]]

      if tv_db_id && genre_db_id
        batch_data << {
          tv_show_id: tv_db_id,
          genre_id: genre_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          TvShowGenre.insert_all(batch_data)
          total_tv_genres += batch_data.size
          tg_batches += 1
          puts "Imported TV show genres batch #{tg_batches} (#{total_tv_genres} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      TvShowGenre.insert_all(batch_data)
      total_tv_genres += batch_data.size
      puts "Imported final TV show genres batch (#{total_tv_genres} total)"
    end
    puts "Completed importing #{total_tv_genres} TV show genres."

    # Import Movie Cast
    puts "\nImporting movie cast..."
    total_movie_cast = 0
    mc_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/movie_cast.csv"), headers: true) do |row|
      movie_db_id = movie_id_map[row["movie_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if movie_db_id && person_db_id
        batch_data << {
          movie_id: movie_db_id,
          person_id: person_db_id,
          character_name: row["character_name"],
          role: row["role"],
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          MovieCast.insert_all(batch_data)
          total_movie_cast += batch_data.size
          mc_batches += 1
          puts "Imported movie cast batch #{mc_batches} (#{total_movie_cast} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      MovieCast.insert_all(batch_data)
      total_movie_cast += batch_data.size
      puts "Imported final movie cast batch (#{total_movie_cast} total)"
    end
    puts "Completed importing #{total_movie_cast} movie cast entries."

    # Import TV Cast
    puts "\nImporting TV cast..."
    total_tv_cast = 0
    tc_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/tv_cast.csv"), headers: true) do |row|
      tv_db_id = tv_show_id_map[row["show_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if tv_db_id && person_db_id
        batch_data << {
          tv_show_id: tv_db_id,
          person_id: person_db_id,
          character_name: row["character_name"],
          role: row["role"],
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          TvShowCast.insert_all(batch_data)
          total_tv_cast += batch_data.size
          tc_batches += 1
          puts "Imported TV cast batch #{tc_batches} (#{total_tv_cast} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      TvShowCast.insert_all(batch_data)
      total_tv_cast += batch_data.size
      puts "Imported final TV cast batch (#{total_tv_cast} total)"
    end
    puts "Completed importing #{total_tv_cast} TV cast entries."

    # Import Movie Directors
    puts "\nImporting movie directors..."
    total_movie_directors = 0
    md_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/movie_directors.csv"), headers: true) do |row|
      movie_db_id = movie_id_map[row["movie_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if movie_db_id && person_db_id
        batch_data << {
          movie_id: movie_db_id,
          person_id: person_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          MovieDirector.insert_all(batch_data)
          total_movie_directors += batch_data.size
          md_batches += 1
          puts "Imported movie directors batch #{md_batches} (#{total_movie_directors} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      MovieDirector.insert_all(batch_data)
      total_movie_directors += batch_data.size
      puts "Imported final movie directors batch (#{total_movie_directors} total)"
    end
    puts "Completed importing #{total_movie_directors} movie directors."

    # Import TV Directors
    puts "\nImporting TV directors..."
    total_tv_directors = 0
    td_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/tv_directors.csv"), headers: true) do |row|
      tv_db_id = tv_show_id_map[row["show_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if tv_db_id && person_db_id
        batch_data << {
          tv_show_id: tv_db_id,
          person_id: person_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          TvShowDirector.insert_all(batch_data)
          total_tv_directors += batch_data.size
          td_batches += 1
          puts "Imported TV directors batch #{td_batches} (#{total_tv_directors} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      TvShowDirector.insert_all(batch_data)
      total_tv_directors += batch_data.size
      puts "Imported final TV directors batch (#{total_tv_directors} total)"
    end
    puts "Completed importing #{total_tv_directors} TV directors."

    # Import Movie Writers
    puts "\nImporting movie writers..."
    total_movie_writers = 0
    mw_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/movie_writers.csv"), headers: true) do |row|
      movie_db_id = movie_id_map[row["movie_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if movie_db_id && person_db_id
        batch_data << {
          movie_id: movie_db_id,
          person_id: person_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          MovieWriter.insert_all(batch_data)
          total_movie_writers += batch_data.size
          mw_batches += 1
          puts "Imported movie writers batch #{mw_batches} (#{total_movie_writers} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      MovieWriter.insert_all(batch_data)
      total_movie_writers += batch_data.size
      puts "Imported final movie writers batch (#{total_movie_writers} total)"
    end
    puts "Completed importing #{total_movie_writers} movie writers."

    # Import TV Writers
    puts "\nImporting TV writers..."
    total_tv_writers = 0
    tw_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/tv_writers.csv"), headers: true) do |row|
      tv_db_id = tv_show_id_map[row["show_id"]]
      person_db_id = person_id_map[row["person_id"]]

      if tv_db_id && person_db_id
        batch_data << {
          tv_show_id: tv_db_id,
          person_id: person_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          TvShowWriter.insert_all(batch_data)
          total_tv_writers += batch_data.size
          tw_batches += 1
          puts "Imported TV writers batch #{tw_batches} (#{total_tv_writers} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch
    if batch_data.any?
      TvShowWriter.insert_all(batch_data)
      total_tv_writers += batch_data.size
      puts "Imported final TV writers batch (#{total_tv_writers} total)"
    end
    puts "Completed importing #{total_tv_writers} TV writers."

    # Import Movie Countries
    puts "\nImporting movie countries..."
    total_movie_countries = 0
    mc_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/movie_countries.csv"), headers: true) do |row|
      movie_id = row["movie_id"]
      country_id = row["country_id"]

      movie_db_id = movie_id_map[movie_id]
      country_db_id = Country.find_by(id: country_id)&.id

      if movie_db_id && country_db_id
        batch_data << {
          movie_id: movie_db_id,
          country_id: country_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          MovieCountry.insert_all(batch_data)
          total_movie_countries += batch_data.size
          mc_batches += 1
          puts "Imported movie countries batch #{mc_batches} (#{total_movie_countries} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch for movie countries
    if batch_data.any?
      MovieCountry.insert_all(batch_data)
      total_movie_countries += batch_data.size
      puts "Imported final movie countries batch (#{total_movie_countries} total)"
    end
    puts "Completed importing #{total_movie_countries} movie countries."

    # Import TV Show Countries
    puts "\nImporting TV show countries..."
    total_tv_countries = 0
    tc_batches = 0
    batch_data = []

    CSV.foreach(Rails.root.join("db/data/tv_countries.csv"), headers: true) do |row|
      show_id = row["show_id"]
      country_id = row["country_id"]

      tv_db_id = tv_show_id_map[show_id]
      country_db_id = Country.find_by(id: country_id)&.id

      if tv_db_id && country_db_id
        batch_data << {
          tv_show_id: tv_db_id,
          country_id: country_db_id,
          created_at: Time.current,
          updated_at: Time.current,
        }

        if batch_data.size >= batch_size
          TvShowCountry.insert_all(batch_data)
          total_tv_countries += batch_data.size
          tc_batches += 1
          puts "Imported TV show countries batch #{tc_batches} (#{total_tv_countries} total)"
          batch_data = []
        end
      end
    end

    # Insert remaining batch for TV show countries
    if batch_data.any?
      TvShowCountry.insert_all(batch_data)
      total_tv_countries += batch_data.size
      puts "Imported final TV show countries batch (#{total_tv_countries} total)"
    end
    puts "Completed importing #{total_tv_countries} TV show countries."

    # Print summary
    end_time = Time.now
    duration = (end_time - start_time).to_i

    puts "\n=== IMDb Import Summary ==="
    puts "Completed in: #{duration} seconds"
    puts "Imported:"
    puts "  - #{genre_count} genres"
    puts "  - #{total_people} people"
    puts "  - #{total_movies} movies"
    puts "  - #{total_series} TV series"
    puts "  - #{total_miniseries} TV miniseries"
    puts "  - #{total_movie_genres} movie genres"
    puts "  - #{total_tv_genres} TV show genres"
    puts "  - #{total_movie_cast} movie cast entries"
    puts "  - #{total_tv_cast} TV cast entries"
    puts "  - #{total_movie_directors} movie directors"
    puts "  - #{total_tv_directors} TV directors"
    puts "  - #{total_movie_writers} movie writers"
    puts "  - #{total_tv_writers} TV writers"
    puts "  - #{country_count} countries"
    puts "  - #{total_movie_countries} movie countries"
    puts "  - #{total_tv_countries} TV show countries"
    puts "=== Import Complete ==="
  end

  desc "Quickly clear all IMDb data from the database"
  task clear: :environment do
    puts "Clearing all IMDb data..."

    MovieGenre.delete_all
    MovieCast.delete_all
    MovieDirector.delete_all
    MovieWriter.delete_all
    TvShowGenre.delete_all
    TvShowCast.delete_all
    TvShowDirector.delete_all
    TvShowWriter.delete_all
    Movie.delete_all
    TvShow.delete_all
    Person.delete_all
    Genre.delete_all
    MovieCountry.delete_all
    TvShowCountry.delete_all
    Country.delete_all

    puts "All IMDb data has been cleared."
  end
end
