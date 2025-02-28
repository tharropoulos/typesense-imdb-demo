class TvShowCountry < ApplicationRecord
  belongs_to :tv_show
  belongs_to :country

  validates :tv_show_id, uniqueness: { scope: :country_id }
end
