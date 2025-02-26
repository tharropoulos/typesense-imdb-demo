class TvShowWriter < ApplicationRecord
  belongs_to :tv_show
  belongs_to :person
end
