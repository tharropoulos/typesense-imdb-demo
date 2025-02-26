class Rating < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :ratable, polymorphic: true

  # Validations
  validates :user_id, presence: true
  validates :score, presence: true,
                    numericality: {
                      greater_than_or_equal_to: 0,
                      less_than_or_equal_to: 5,
                      only_integer: false,
                    }
  validates :review, length: { maximum: 355 }, allow_blank: true
  validates :user_id, uniqueness: { scope: [:ratable_type, :ratable_id],
                                    message: "has already rated this content" }

  # Custom validation for 0.5 increments
  validate :score_has_valid_increment

  # Scopes
  scope :with_reviews, -> { where.not(review: [nil, ""]) }
  scope :recent, -> { order(created_at: :desc) }

  private

  def score_has_valid_increment
    return if score.nil?

    # Ensure score is in 0.5 increments by checking if it's a multiple of 0.5
    unless (score * 10) % 5 == 0
      errors.add(:score, "must be in 0.5 increments (e.g., 0, 0.5, 1.0, 1.5, etc.)")
    end
  end
end
