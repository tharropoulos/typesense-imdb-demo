namespace :db do
  desc "Reset users table and restart ID sequence"
  task reset_users: :environment do
    puts "Deleting all users and resetting ID sequence..."

    # Detect database type and use appropriate command
    adapter = ActiveRecord::Base.connection.adapter_name.downcase

    case adapter
    when "postgresql"
      ActiveRecord::Base.connection.execute("TRUNCATE users RESTART IDENTITY;")
    when "mysql", "mysql2"
      ActiveRecord::Base.connection.execute("TRUNCATE users;")
    when "sqlite"
      ActiveRecord::Base.connection.execute("DELETE FROM users;")
      ActiveRecord::Base.connection.execute("DELETE FROM sqlite_sequence WHERE name='users';")
    else
      puts "Unknown database adapter: #{adapter}"
      User.delete_all
    end

    puts "Users table reset successfully!"
  end

  desc "Generate 138,493 random users with Faker (optimized version)"
  task seed_users: :environment do
    require "faker"
    require "bcrypt"
    start_time = Time.now

    puts "Deleting all existing users..."
    adapter = ActiveRecord::Base.connection.adapter_name.downcase

    case adapter
    when "postgresql"
      ActiveRecord::Base.connection.execute("TRUNCATE users RESTART IDENTITY;")
    when "mysql", "mysql2"
      ActiveRecord::Base.connection.execute("TRUNCATE users;")
    when "sqlite"
      ActiveRecord::Base.connection.execute("DELETE FROM users;")
      ActiveRecord::Base.connection.execute("DELETE FROM sqlite_sequence WHERE name='users';")
    else
      puts "Unknown database adapter: #{adapter}"
      User.delete_all
    end

    puts "All users deleted successfully."

    total_users = 138_493
    batch_size = ENV.fetch("BATCH_SIZE", 5000).to_i
    puts "Starting to generate #{total_users} users in batches of #{batch_size}..."

    # For uniqueness tracking
    usernames = Set.new

    # Initialize counters
    users_created = 0
    batches_processed = 0

    puts "Precomputing passwords..."
    password_hashes = 20.times.map do
      BCrypt::Password.create("Super_secret_p@ss")
    end

    while users_created < total_users
      # Calculate batch size for this iteration
      current_batch_size = [batch_size, total_users - users_created].min

      # Generate batch data
      puts "Generating batch #{batches_processed + 1} (#{users_created}/#{total_users})..."

      user_batch = []
      current_batch_size.times do
        # Generate a unique username
        username = nil
        5.times do # Try up to 5 times to get a unique username
          temp_username = Faker::Internet.unique.username(specifier: nil, separators: %w[. _ -])
          unless usernames.include?(temp_username)
            username = temp_username
            usernames.add(username)
            break
          end
        end

        # If we couldn't get a unique username after 5 tries, create a truly unique one
        unless username
          username = "user_#{SecureRandom.hex(8)}"
          usernames.add(username)
        end

        email = "#{username}@#{Faker::Internet.domain_name}"

        # Use one of our precomputed password hashes
        encrypted_password = password_hashes.sample

        user_batch << {
          email: email,
          encrypted_password: encrypted_password,
          username: username,
          created_at: Time.current,
          updated_at: Time.current,
        }
      end

      # Insert the batch
      User.insert_all(user_batch)

      # Update counters
      users_created += current_batch_size
      batches_processed += 1

      # Report progress
      percent_complete = ((users_created.to_f / total_users) * 100).round(2)
      puts "Progress: #{users_created}/#{total_users} users (#{percent_complete}%)"
    end

    end_time = Time.now
    duration = (end_time - start_time).to_i

    puts "Successfully generated #{User.count} users in #{duration} seconds!"
    puts "Average speed: #{(User.count / duration.to_f).round(2)} users/second"
  end

  desc "Generate users with batch creation (even faster)"
  task seed_users_fast: :environment do
    require "faker"
    require "securerandom"
    require "bcrypt"
    start_time = Time.now

    puts "Deleting all existing users..."
    User.delete_all
    puts "All users deleted successfully."

    total_users = ENV.fetch("TOTAL_USERS", 138_493).to_i
    batch_size = ENV.fetch("BATCH_SIZE", 10000).to_i

    puts "Starting to generate #{total_users} users in batches of #{batch_size}..."
    puts "NOTE: This method bypasses validations for maximum speed"

    # Generate a single encrypted password to use for all users
    # This dramatically speeds up the process while still being secure
    # In a real app, users would reset their password on first login
    common_password = BCrypt::Password.create("Super_secret_p@ss")

    users_created = 0
    batches_processed = 0

    # Create a domain array to avoid calling Faker each time
    domains = 100.times.map { Faker::Internet.domain_name }

    while users_created < total_users
      current_batch_size = [batch_size, total_users - users_created].min

      # Generate batch data
      puts "Generating batch #{batches_processed + 1} (#{users_created}/#{total_users})..."

      now = Time.current

      # Ultra-fast user generation with guaranteed uniqueness
      user_batch = current_batch_size.times.map do |i|
        # Create deterministically unique usernames
        unique_id = users_created + i
        username = "user_#{unique_id}"
        domain = domains.sample

        {
          email: "#{username}@#{domain}",
          encrypted_password: common_password,
          created_at: now,
          updated_at: now,
        }
      end

      # Insert the batch directly
      User.insert_all(user_batch)

      # Update counters
      users_created += current_batch_size
      batches_processed += 1

      # Report progress
      percent_complete = ((users_created.to_f / total_users) * 100).round(2)
      puts "Progress: #{users_created}/#{total_users} users (#{percent_complete}%)"
    end

    end_time = Time.now
    duration = (end_time - start_time).to_i

    puts "Successfully generated #{User.count} users in #{duration} seconds!"
    puts "Average speed: #{(User.count / duration.to_f).round(2)} users/second"
  end
end
