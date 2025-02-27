class DropCountriesFromMovie < ActiveRecord::Migration[7.0]
  def up
    remove_column :movies, :countries
  end

  def down
    add_column :movies, :countries, :string
  end
end
