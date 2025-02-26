class CreateMovieCasts < ActiveRecord::Migration[8.0]
  def change
    create_table :movie_casts do |t|
      t.references :movie, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true
      t.string :character_name
      t.string :role

      t.timestamps
    end
  end
end
