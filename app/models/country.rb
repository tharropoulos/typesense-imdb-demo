class Country < ApplicationRecord
  has_many :movie_countries, dependent: :destroy
  has_many :movies, through: :movie_countries

  validates :name, presence: true, uniqueness: true
end
