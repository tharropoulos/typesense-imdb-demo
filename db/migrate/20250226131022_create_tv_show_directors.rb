class CreateTvShowDirectors < ActiveRecord::Migration[8.0]
  def change
    create_table :tv_show_directors do |t|
      t.references :tv_show, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
