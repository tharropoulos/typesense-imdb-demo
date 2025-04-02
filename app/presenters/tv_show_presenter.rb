class TvShowPresenter
  def initialize(tv_show)
    @tv_show = tv_show
  end

  def as_json
    base_json = @tv_show.as_json(
      only: [:id, :title, :start_year, :end_year, :primary_image_url, :description, :runtime_minutes, :average_rating, :content_rating, :total_episodes, :total_seasons],
      methods: [:countries, :genres, :reviews],
    )

    base_json["casts"] = @tv_show.tv_show_casts.as_json(
      only: [:id, :character_name, :role],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json["directors"] = @tv_show.tv_show_directors.as_json(
      only: [:id],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json["writers"] = @tv_show.tv_show_writers.as_json(
      only: [:id],
      include: { person: { only: [:id, :full_name, :url] } },
    )

    base_json
  end
end
