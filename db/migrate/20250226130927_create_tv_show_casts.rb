class CreateTvShowCasts < ActiveRecord::Migration[8.0]
  def change
    create_table :tv_show_casts do |t|
      t.references :tv_show, null: false, foreign_key: true
      t.references :person, null: false, foreign_key: true
      t.string :character_name
      t.string :role

      t.timestamps
    end
  end
end
