class MovieCountry < ApplicationRecord
  belongs_to :movie
  belongs_to :country

  validates :movie_id, uniqueness: { scope: :country_id }
end
