require 'typesense'
require 'net/http'
require 'uri'
require 'json'
require 'fileutils'

namespace :typesense do
  desc 'Set up Typesense personalization model, presets, and analytics rules. Usage: rake typesense:setup[model_path]'
  task :setup, [:model_path] => :environment do |t, args|
    # Set default model path if not provided
    model_path = args[:model_path] || 'movie-recommendations-model.tar.gz'
    
    typesense_client = Typesense::Client.new(
        nodes: [{
            host: ENV["TYPESENSE_HOST"] || "localhost",
            port: ENV["TYPESENSE_PORT"] || 8108,
            protocol: ENV["TYPESENSE_PROTOCOL"] || "http",
        }],
        api_key: ENV["TYPESENSE_API_KEY"] || "xyz",
        connection_timeout_seconds: 2000,
        retry_interval_seconds: 3,
        num_retries: 5,
    )

    # Create personalization model
    puts "Creating personalization model..."
    model_id = "movie_personalization_model"
    
    unless personalization_model_exists?(model_id)
      model_file_path = Rails.root.join(model_path)
      
      unless File.exist?(model_file_path)
        puts "Error: Model file not found at #{model_file_path}"
        exit 1
      end
      
      file_data = File.binread(model_file_path)
      
      uri = URI.parse("http://localhost:8108/personalization/models?name=ts/tyrec-1&type=recommendation&collection=Movie&id=#{model_id}")
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/octet-stream"
      request["X-TYPESENSE-API-KEY"] = "xyz" 
      request.body = file_data
      
      response = Net::HTTP.start(uri.hostname, uri.port) do |http|
        http.request(request)
      end
      
      if response.code == "200"
        result = JSON.parse(response.body)
        puts "Personalization model created successfully: #{result}"
      else
        puts "Failed to create personalization model: #{response.body}"
      end
    else
      puts "Personalization model #{model_id} already exists, skipping creation."
    end

    # Create movie recommendations preset
    puts "Creating movie recommendations preset..."
    begin
      response = typesense_client.presets.upsert("movie_recommendations", {
        value: {
          q: "*",
          exclude_fields: "user_embedding, item_embedding",
          personalization_model_id: "movie_personalization_model",
          personalization_type: "recommendation",
          personalization_user_field: "user_embedding",
          personalization_item_field: "item_embedding",
          personalization_event_name: "movie_click",
          personalization_n_events: 8,
          page: 1
        }
      })
      puts "Movie recommendations preset created successfully: #{response}"
    rescue => e
      puts "Error creating movie recommendations preset: #{e.message}"
    end

    # Create TV show recommendations preset
    puts "Creating TV show recommendations preset..."
    begin
      response = typesense_client.presets.upsert("tv_show_recommendations", {
        value: {
          q: "*",
          exclude_fields: "user_embedding, item_embedding",
          personalization_model_id: "movie_personalization_model",
          personalization_type: "recommendation",
          personalization_user_field: "user_embedding",
          personalization_item_field: "item_embedding",
          personalization_event_name: "tv_show_click",
          personalization_n_events: 8,
          page: 1
        }
      })
      puts "TV show recommendations preset created successfully: #{response}"
    rescue => e
      puts "Error creating TV show recommendations preset: #{e.message}"
    end

    # Create analytics rules
    puts "Creating analytics rules..."
    begin
      movie_rule = typesense_client.analytics.rules.upsert("movie_analytics_rule", {
        params: {
          source: {
            collections: ["Movie"],
            events: [
              {
                name: "movie_click",
                type: "click",
                weight: 2
              }
            ]
          }
        },
        type: "log"
      })
      
      tv_show_rule = typesense_client.analytics.rules.upsert("tv_show_analytics_rule", {
        params: {
          source: {
            collections: ["TvShow"],
            events: [
              {
                name: "tv_show_click",
                type: "click",
                weight: 2
              }
            ]
          }
        },
        type: "log"
      })
      
      puts "Analytics rules created successfully: #{movie_rule}"
      puts "Analytics rules created successfully: #{tv_show_rule}"
    rescue => e
      puts "Error creating analytics rules: #{e.message}"
    end

    puts "All operations completed successfully!"
  end

  private

  def personalization_model_exists?(model_id)
    uri = URI.parse("http://localhost:8108/personalization/models/#{model_id}")
    request = Net::HTTP::Get.new(uri)
    request["X-TYPESENSE-API-KEY"] = "xyz"
    
    response = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(request)
    end
    
    if response.code == "200"
      result = JSON.parse(response.body)
      puts "Personalization model #{model_id} already exists: #{result}"
      return true
    end
    
    false
  rescue => e
    puts "Error checking if personalization model #{model_id} exists: #{e.message}"
    false
  end
end 