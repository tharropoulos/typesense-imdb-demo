class TvShowGenre < ApplicationRecord
  belongs_to :tv_show
  belongs_to :genre
end
