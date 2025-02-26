class CreatePeople < ActiveRecord::Migration[8.0]
  def change
    create_table :people do |t|
      t.string :person_id, null: false, index: { unique: true }
      t.string :full_name
      t.string :url

      t.timestamps
    end
  end
end
