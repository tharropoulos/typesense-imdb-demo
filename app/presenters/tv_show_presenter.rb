class TvShowPresenter
  def initialize(tv_show)
    @tv_show = tv_show
  end

  def as_json
    base_json = @tv_show.as_json(
      only: [:id, :title, :start_year, :end_year, :primary_image_url, :description, :average_rating, :content_rating, :total_episodes, :total_seasons],
      methods: [:countries, :genres, :reviews],
    )

    base_json["collection_type"] = "tv_show"

    base_json["casts"] = @tv_show.cast_members.map do |cast|
      {
        id: cast.id,
        character_name: cast.tv_show_casts.find_by(tv_show_id: @tv_show.id)&.character_name,
        role: cast.tv_show_casts.find_by(tv_show_id: @tv_show.id)&.role,
        person: {
          id: cast.id,
          full_name: cast.full_name,
          url: cast.url,
        },
      }
    end

    base_json["directors"] = @tv_show.directors.map do |director|
      {
        id: director.id,
        person: {
          id: director.id,
          full_name: director.full_name,
          url: director.url,
        },
      }
    end

    base_json["writers"] = @tv_show.writers.map do |writer|
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
