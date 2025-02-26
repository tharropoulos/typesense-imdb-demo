namespace :db do
  desc "Delete all users from the database"
  task delete_users: :environment do
    puts "Deleting all users..."
    count = User.count
    User.delete_all
    puts "Successfully deleted #{count} users."
  end

  desc "Generate 138,493 random users with Faker"
  task seed_users: :environment do
    require "faker"

    puts "Deleting all existing users..."
    User.delete_all
    puts "All users deleted successfully."

    puts "Starting to generate 138,493 users..."
    total_users = 138_493
    progress_interval = 5000  # Show progress every 5000 users

    total_users.times do |i|
      email = "#{Faker::Internet.unique.username}@#{Faker::Internet.domain_name}"
      password = Faker::Internet.password(min_length: 8, max_length: 20)

      User.create!(
        email: email,
        password: password,
        password_confirmation: password,
      )

      if (i + 1) % progress_interval == 0
        puts "Progress: #{i + 1}/#{total_users} users (#{((i + 1.0) / total_users * 100).round}%)"
      end
    end

    puts "Successfully generated #{User.count} users!"
  end
end
