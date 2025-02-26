class TvShowCast < ApplicationRecord
  belongs_to :tv_show
  belongs_to :person
end
