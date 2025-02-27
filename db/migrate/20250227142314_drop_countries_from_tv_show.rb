class DropCountriesFromTvShow < ActiveRecord::Migration[8.0]
  def up
    remove_column :tv_shows, :countries
  end

  def down
    add_column :tv_shows, :countries, :string
  end
end
