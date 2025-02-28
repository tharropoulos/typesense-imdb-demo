class ChangeTvShowsDecimalColumnsToIntegers < ActiveRecord::Migration[8.0]
  def up
    add_column :tv_shows, :start_year_temp, :integer
    add_column :tv_shows, :end_year_temp, :integer
    add_column :tv_shows, :total_seasons_temp, :integer
    add_column :tv_shows, :total_episodes_temp, :integer

    execute <<-SQL
      UPDATE tv_shows 
      SET start_year_temp = ROUND(start_year),
          end_year_temp = ROUND(end_year),
          total_seasons_temp = ROUND(total_seasons),
          total_episodes_temp = ROUND(total_episodes)
    SQL

    # Remove the old columns
    remove_column :tv_shows, :start_year
    remove_column :tv_shows, :end_year
    remove_column :tv_shows, :total_seasons
    remove_column :tv_shows, :total_episodes

    # Rename the temporary columns to the original names
    rename_column :tv_shows, :start_year_temp, :start_year
    rename_column :tv_shows, :end_year_temp, :end_year
    rename_column :tv_shows, :total_seasons_temp, :total_seasons
    rename_column :tv_shows, :total_episodes_temp, :total_episodes
  end

  def down
    # Rollback changes if needed
    change_column :tv_shows, :start_year, :decimal, precision: 4, scale: 1
    change_column :tv_shows, :end_year, :decimal, precision: 4, scale: 1
    change_column :tv_shows, :total_seasons, :decimal, precision: 3, scale: 1
    change_column :tv_shows, :total_episodes, :decimal, precision: 5, scale: 1
  end
end
