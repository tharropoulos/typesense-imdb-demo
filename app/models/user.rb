class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }

  # Rating association
  has_many :ratings, dependent: :destroy

  # Helper methods for ratings
  def rated_movies
    Movie.joins(:ratings).where(ratings: { user_id: id, ratable_type: "Movie" })
  end

  def rated_tv_shows
    TvShow.joins(:ratings).where(ratings: { user_id: id, ratable_type: "TvShow" })
  end

  def movie_ratings
    ratings.where(ratable_type: "Movie")
  end

  def tv_show_ratings
    ratings.where(ratable_type: "TvShow")
  end

  def recent_ratings(limit = 10)
    ratings.order(created_at: :desc).limit(limit)
  end

  def has_rated?(ratable)
    ratings.exists?(ratable: ratable)
  end

  def rating_for(ratable)
    ratings.find_by(ratable: ratable)
  end

  def profile_pic
    user_seed = username.present? ? username[0...3] : id.to_s
    set_number = (id % 5) + 1
    "https://robohash.org/#{user_seed}?set=set#{set_number}&size=150x150"
  end
end
