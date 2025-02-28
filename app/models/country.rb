class Country < ApplicationRecord
  has_many :movie_countries, dependent: :destroy
  has_many :movies, through: :movie_countries

  has_many :tv_show_countries, dependent: :destroy
  has_many :tv_shows, through: :tv_show_countries

  validates :name, presence: true, uniqueness: true
end
