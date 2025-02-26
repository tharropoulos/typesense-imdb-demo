class CreateTvShows < ActiveRecord::Migration[8.0]
  def change
    create_table :tv_shows do |t|
      t.string :show_id, null: false, index: { unique: true }
      t.string :title
      t.string :original_title
      t.decimal :start_year, precision: 4, scale: 1
      t.decimal :end_year, precision: 4, scale: 1
      t.text :description
      t.string :content_rating
      t.decimal :average_rating, precision: 3, scale: 1
      t.integer :num_votes
      t.decimal :total_seasons, precision: 3, scale: 1
      t.decimal :total_episodes, precision: 5, scale: 1
      t.string :primary_image_url
      t.string :countries
      t.string :show_type # 'series' or 'miniseries'

      t.timestamps
    end
  end
end
