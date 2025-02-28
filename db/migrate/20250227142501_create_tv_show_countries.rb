class CreateTvShowCountries < ActiveRecord::Migration[8.0]
  def change
    create_table :tv_show_countries do |t|
      t.references :tv_show, null: false, foreign_key: true
      t.references :country, null: false, foreign_key: true

      t.timestamps
    end
  end
end
