class TvShow < ApplicationRecord
  include Typesense

  # Rating association
  has_many :ratings, as: :ratable, dependent: :destroy
  # Genre associations
  has_many :tv_show_genres, dependent: :destroy
  has_many :genres, through: :tv_show_genres

  # Cast, directors and writers associations
  has_many :tv_show_casts, dependent: :destroy
  has_many :cast_members, through: :tv_show_casts, source: :person

  has_many :tv_show_directors, dependent: :destroy
  has_many :directors, through: :tv_show_directors, source: :person

  has_many :tv_show_writers, dependent: :destroy
  has_many :writers, through: :tv_show_writers, source: :person

  # Validation
  validates :show_id, presence: true, uniqueness: true

  has_many :tv_show_countries, dependent: :destroy
  has_many :countries, through: :tv_show_countries

  typesense do
    predefined_fields [
      { "name" => "show_id", "type" => "string" },
      { "name" => "title", "type" => "string" },
      { "name" => "original_title", "type" => "string", "optional" => true },
      { "name" => "start_year", "type" => "int32", "facet" => true },
      { "name" => "end_year", "type" => "int32" },
      { "name" => "description", "type" => "string", "optional" => true },
      { "name" => "content_rating", "type" => "string", "optional" => true },
      { "name" => "average_rating", "type" => "float", "facet" => true },
      { "name" => "num_votes", "type" => "int32", "optional" => true },
      { "name" => "total_seasons", "type" => "int32", "optional" => true },
      { "name" => "total_episodes", "type" => "int32", "optional" => true },
      { "name" => "genres", "type" => "string[]", "facet" => true },
      { "name" => "countries", "type" => "string[]", "optional" => true, "facet" => true },
      { "name" => "primary_image_url", "type" => "string", "index" => false },
      { "name" => "show_type", "type" => "string", "facet" => true },
      { "name" => "primary_genre", "type" => "string" },
      { "name" => "secondary_genre", "type" => "string", "optional" => true },
      { "name" => "collection_type", "type" => "string" },
      { "name" => "cast", "type" => "string[]", "facet" => true },
      { "name" => "directors", "type" => "string[]", "facet" => true },
      { "name" => "user_embedding", "type" => "float[]",
       "embed" => {
        "from" => [
          "genres",
          "title",
          "cast",
          "directors",
        ],
        "mapping" => [
          "tv_show_genres",
          "tv_show_title",
          "actors",
          "directors",
        ],
        "model_config" => {
          "model_name" => "ts/tyrec-1",
          "personalization_type" => "recommendation",
          "personalization_model_id" => "movie_personalization_model",
          "personalization_embedding_type" => "user",
        },
      } },
      { "name" => "item_embedding", "type" => "float[]",
       "embed" => {
        "from" => [
          "genres",
          "title",
          "cast",
          "directors",
        ],
        "mapping" => [
          "tv_show_genres",
          "tv_show_title",
          "actors",
          "directors",
        ],
        "model_config" => {
          "model_name" => "ts/tyrec-1",
          "personalization_type" => "recommendation",
          "personalization_model_id" => "movie_personalization_model",
          "personalization_embedding_type" => "item",
        },
      } },
    ]

    default_sorting_field "average_rating"

    attribute :genres do
      genres.pluck(:name).take(3)
    end

    attribute :countries do
      countries.pluck(:name)
    end

    attribute :collection_type do
      "tv_show"
    end

    attribute :cast do
      cast_members.pluck(:full_name).take(3)
    end

    attribute :directors do
      directors.pluck(:full_name).take(3)
    end

    attribute :id, :show_id, :title, :original_title,
              :description, :content_rating, :start_year, :end_year,
              :num_votes, :average_rating, :total_seasons, :total_episodes,
              :primary_image_url, :show_type

    attribute :average_rating do
      self.average_rating.to_f if self.average_rating.present?
    end

    attribute :primary_genre do
      self.genres.first[:name] if self.genres.present?
    end

    attribute :secondary_genre do
      self.genres.second[:name] if self.genres.size > 1
    end
  end

  def reviews
    Rating.where(ratable_id: self.id, ratable_type: self.class.name)
          .with_reviews
          .recent
          .limit(4)
          .includes(:user)
          .map do |rating|
      {
        id: rating.id,
        score: rating.score,
        review: rating.review,
        created_at: rating.created_at,
        updated_at: rating.updated_at,
        user: {
          id: rating.user.id,
          username: rating.user.username,
          profile_pic: rating.user.profile_pic,
        },
      }
    end
  end

  def countries
    tv_show_countries.map do |tv_show_country|
      {
        id: tv_show_country.id,
        name: tv_show_country.country.name,
      }
    end
  end

  def genres
    tv_show_genres.limit(4).map do |tv_show_genre|
      {
        id: tv_show_genre.id,
        name: tv_show_genre.genre.name,
      }
    end
  end

  # Scopes
  scope :series, -> { where(show_type: "series") }
  scope :miniseries, -> { where(show_type: "miniseries") }
  scope :by_genre, ->(genre_name) { joins(:genres).where(genres: { name: genre_name }) }
  scope :by_year, ->(year) { where("start_year <= ? AND end_year >= ?", year, year) }
  scope :by_rating, ->(min_rating) { where("average_rating >= ?", min_rating) }
end
