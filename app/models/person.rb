class Person < ApplicationRecord
  include Typesense
  # Movie relationships
  has_many :movie_casts, dependent: :destroy
  has_many :acted_movies, through: :movie_casts, source: :movie

  has_many :movie_directors, dependent: :destroy
  has_many :directed_movies, through: :movie_directors, source: :movie

  has_many :movie_writers, dependent: :destroy
  has_many :written_movies, through: :movie_writers, source: :movie

  # TV Show relationships
  has_many :tv_show_casts, dependent: :destroy
  has_many :acted_tv_shows, through: :tv_show_casts, source: :tv_show

  has_many :tv_show_directors, dependent: :destroy
  has_many :directed_tv_shows, through: :tv_show_directors, source: :tv_show

  has_many :tv_show_writers, dependent: :destroy
  has_many :written_tv_shows, through: :tv_show_writers, source: :tv_show

  # Validation
  validates :person_id, presence: true, uniqueness: true

  typesense do
    predefined_fields [
      { "name" => "person_id", "type" => "string" },
      { "name" => "full_name", "type" => "string" },
      { "name" => "url", "type" => "string", "optional" => true, "index" => false },
    ]
    attribute :id, :person_id, :full_name, :url
  end
end
