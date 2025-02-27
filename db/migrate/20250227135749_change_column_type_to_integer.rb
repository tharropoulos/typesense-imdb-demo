class ChangeColumnTypeToInteger < ActiveRecord::Migration[7.0] # Use your Rails version here
  def up
    # First, create a temporary column
    add_column :movies, :release_year_temp, :integer

    # Copy data with conversion (rounds to nearest integer)
    # Adjust this if you need different rounding behavior
    execute <<-SQL
      UPDATE movies 
      SET release_year_temp = ROUND(release_year)
    SQL

    # Remove the old column
    remove_column :movies, :release_year

    # Rename the temporary column to the original name
    rename_column :movies, :release_year_temp, :release_year
  end

  def down
    # If you need to roll back
    change_column :movies, :column_name, :decimal, precision: 4, scale: 1
  end
end
