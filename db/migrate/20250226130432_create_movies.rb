class CreateMovies < ActiveRecord::Migration[8.0]
  def change
    create_table :movies do |t|
      t.string :movie_id, null: false, index: { unique: true }
      t.string :title
      t.string :original_title
      t.decimal :release_year, precision: 4, scale: 1
      t.text :description
      t.string :content_rating
      t.date :release_date
      t.integer :runtime_minutes
      t.decimal :average_rating, precision: 1, scale: 1
      t.integer :num_votes
      t.decimal :budget, precision: 15, scale: 2
      t.decimal :gross_worldwide, precision: 15, scale: 2
      t.string :primary_image_url
      t.string :countries

      t.timestamps
    end
  end
end