class MoviePresenter
  def initialize(movie)
    @movie = movie
  end

  def as_json
    base_json = @movie.as_json(
      only: [:id, :title, :release_year, :primary_image_url, :description, :runtime_minutes, :average_rating, :content_rating, :collection_type],
      methods: [:countries, :genres, :reviews],
    )

    base_json["casts"] = @movie.movie_casts.as_json(
      only: [:id, :character_name, :role],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json["directors"] = @movie.movie_directors.as_json(
      only: [:id],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json["writers"] = @movie.movie_writers.as_json(
      only: [:id],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json
  end
end
