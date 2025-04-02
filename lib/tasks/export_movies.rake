namespace :movies do
  desc "Export all movies to a JSONL file for Typesense import"
  task export_for_typesense: :environment do
    output_file = "#{Rails.root}/tmp/movies_for_typesense.jsonl"

    # Create output directory if it doesn't exist
    FileUtils.mkdir_p(File.dirname(output_file))

    puts "Starting export of movies to #{output_file}..."

    total_movies = Movie.count
    counter = 0

    File.open(output_file, "w") do |file|
      Movie.find_each.with_index do |movie, index|
        # Create document with all the fields Typesense expects
        document = {
          id: movie.id.to_s,
          movie_id: movie.movie_id,
          title: movie.title,
          original_title: movie.original_title,
          release_year: movie.release_year,
          description: movie.description,
          content_rating: movie.content_rating,
          release_date: movie.release_date&.to_time&.to_i,
          runtime_minutes: movie.runtime_minutes,
          average_rating: movie.average_rating.to_f,
          num_votes: movie.num_votes,
          genres: movie.genres.pluck(:name).take(3),
          country_names: movie.countries.pluck(:name).take(3),
          primary_image_url: movie.primary_image_url,
          primary_genre: movie.genres.first&.name,
          secondary_genre: movie.genres.second&.name,
          cast: movie.cast_members.pluck(:full_name).take(1),
          directors: movie.directors.pluck(:full_name).take(1),
          collection_type: "movie",
        }

        # Write document as a JSON line
        file.puts(document.to_json)

        # Progress tracking
        counter += 1
        if counter % 1000 == 0
          puts "Processed #{counter}/#{total_movies} movies (#{(counter.to_f / total_movies * 100).round(2)}%)"
        end
      end
    end

    puts "Finished exporting #{counter} movies to #{output_file}"
  end
end
