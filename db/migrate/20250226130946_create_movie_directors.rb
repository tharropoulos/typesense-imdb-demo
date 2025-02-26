class CreateMovieDirectors < ActiveRecord::Migration[8.0]
  def change
    create_table :movie_directors do |t|
      t.references :movie, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
