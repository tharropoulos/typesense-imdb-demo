class Movie < ApplicationRecord
  include Typesense
  has_many :ratings, as: :ratable, dependent: :destroy

  # Genre associations
  has_many :movie_genres, dependent: :destroy
  has_many :genres, through: :movie_genres

  # Cast, directors and writers associations
  has_many :movie_casts, dependent: :destroy
  has_many :cast_members, through: :movie_casts, source: :person

  has_many :movie_directors, dependent: :destroy
  has_many :directors, through: :movie_directors, source: :person

  has_many :movie_writers, dependent: :destroy
  has_many :writers, through: :movie_writers, source: :person

  # Country associations
  has_many :movie_countries, dependent: :destroy
  has_many :countries, through: :movie_countries

  validates :movie_id, presence: true, uniqueness: true

  typesense do
    predefined_fields [
                        { "name" => "movie_id", "type" => "string" },
                        { "name" => "title", "type" => "string" },
                        { "name" => "original_title", "type" => "string", "optional" => true },
                        { "name" => "release_year", "type" => "int32", "facet" => true },
                        { "name" => "description", "type" => "string", "optional" => true },
                        { "name" => "content_rating", "type" => "string", "optional" => true },
                        { "name" => "release_date", "type" => "int64", "optional" => true },
                        { "name" => "runtime_minutes", "type" => "int32", "optional" => true },
                        { "name" => "average_rating", "type" => "float", "facet" => true },
                        { "name" => "num_votes", "type" => "int32", "optional" => true },
                        { "name" => "genres", "type" => "string[]", "facet" => true },
                        { "name" => "countries", "type" => "string[]", "optional" => true, "facet" => true },
                        { "name" => "primary_image_url", "type" => "string", "index" => false },
                        { "name" => "primary_genre", "type" => "string" },
                        { "name" => "secondary_genre", "type" => "string", "optional" => true },
                        { "name" => "cast", "type" => "string[]", "facet" => true },
                        { "name" => "directors", "type" => "string[]", "facet" => true },
                        { "name" => "collection_type", "type" => "string" },
                        {
                          "name" => "embedding",
                          "type" => "float[]",
                          "embed" => {
                            "from" => ["title"],
                            "model_config" => {
                              "model_name" => "ts/snowflake-arctic-embed-m",
                            },
                          },
                        },

                        { "name" => "user_embedding", "type" => "float[]",
                         "embed" => {
                          "from" => [
                            "genres",
                            "title",
                            "cast",
                            "directors",
                          ],
                          "mapping" => [
                            "movie_genres",
                            "movie_title",
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
                            "movie_genres",
                            "movie_title",
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

    attribute :id, :movie_id, :title, :original_title,
    attribute :collection_type do
      "movie"
    end

    attribute :cast do
      cast_members.pluck(:full_name).take(3)
    end

    attribute :directors do
      directors.pluck(:full_name).take(3)
    end

              :description, :content_rating, :release_date, :runtime_minutes,
              :num_votes, :release_year, :primary_image_url

    attribute :release_date do
      self.release_date.to_time.to_i if self.release_date.present?
    end

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

  # Scopes
  def countries
    movie_countries.map do |movie_country|
      {
        id: movie_country.id,
        name: movie_country.country.name,
      }
    end
  end
  scope :by_genre, ->(genre_name) { joins(:genres).where(genres: { name: genre_name }) }
  scope :by_year, ->(year) { where("release_year = ?", year) }
  scope :by_rating, ->(min_rating) { where("average_rating >= ?", min_rating) }
end
