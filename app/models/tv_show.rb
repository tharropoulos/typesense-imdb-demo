class TvShow < ApplicationRecord
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

  # Scopes
  scope :series, -> { where(show_type: "series") }
  scope :miniseries, -> { where(show_type: "miniseries") }
  scope :by_genre, ->(genre_name) { joins(:genres).where(genres: { name: genre_name }) }
  scope :by_year, ->(year) { where("start_year <= ? AND end_year >= ?", year, year) }
  scope :by_rating, ->(min_rating) { where("average_rating >= ?", min_rating) }
end
