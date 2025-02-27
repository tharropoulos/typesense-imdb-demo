class CreateMovieCountries < ActiveRecord::Migration[8.0]
  def change
    create_table :movie_countries do |t|
      t.references :movie, null: false, foreign_key: true
      t.references :country, null: false, foreign_key: true

      t.timestamps
    end
  end
end
