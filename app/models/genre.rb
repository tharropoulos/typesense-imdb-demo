class Genre < ApplicationRecord
  has_many :movie_genres, dependent: :destroy
  has_many :movies, through: :movie_genres

  has_many :tv_show_genres, dependent: :destroy
  has_many :tv_shows, through: :tv_show_genres

  validates :name, presence: true, uniqueness: true
end
