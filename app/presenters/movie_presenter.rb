class MoviePresenter
  def initialize(movie)
    @movie = movie
  end

  def as_json
    base_json = @movie.as_json(
      only: [:id, :title, :release_year, :primary_image_url, :description, :runtime_minutes, :average_rating, :content_rating],
      methods: [:countries, :genres, :reviews],
    )

    base_json["collection_type"] = "movie"

    base_json["casts"] = @movie.cast_members.map do |cast|
      {
        id: cast.id,
        character_name: cast.movie_casts.find_by(movie_id: @movie.id)&.character_name,
        role: cast.movie_casts.find_by(movie_id: @movie.id)&.role,
        person: {
          id: cast.id,
          full_name: cast.full_name,
          url: cast.url,
        },
      }
    end

    base_json["directors"] = @movie.directors.map do |director|
      {
        id: director.id,
        person: {
          id: director.id,
          full_name: director.full_name,
          url: director.url,
        },
      }
    end

    base_json["writers"] = @movie.writers.map do |writer|
      {
        id: writer.id,
        person: {
          id: writer.id,
          full_name: writer.full_name,
          url: writer.url,
        },
      }
    end

    base_json
  end
end
