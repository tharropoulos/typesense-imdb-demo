class CreateRatings < ActiveRecord::Migration[8.0]
  def change
    create_table :ratings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :ratable, polymorphic: true, null: false
      t.decimal :score, precision: 2, scale: 1, null: false
      t.text :review, limit: 355
      t.timestamps

      # Ensure a user can only rate a specific movie/show once
      t.index [:user_id, :ratable_type, :ratable_id], unique: true, name: "idx_ratings_on_user_and_ratable"
    end
  end
end
