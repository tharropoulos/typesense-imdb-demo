class Movie < ApplicationRecord
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

  # Validation
  validates :movie_id, presence: true, uniqueness: true

  # Scopes
  scope :by_genre, ->(genre_name) { joins(:genres).where(genres: { name: genre_name }) }
  scope :by_year, ->(year) { where("release_year = ?", year) }
  scope :by_rating, ->(min_rating) { where("average_rating >= ?", min_rating) }
end
