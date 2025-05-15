# 📽️ IMDB Personalization Demo with Typesense & Ruby on Rails

A movie and TV show discovery application that provides personalized recommendations using Typesense's powerful search and recommendation capabilities.

<div align="center">
  <img src="showcase.gif" alt="showcase" width=99%>
</div>


## Features

- **Typesense Rails**: Rails Gem for automatic sync between your Rails App and Typesense
- **Advanced Search**: Fast, typo-tolerant search across movies and TV shows
- **Personalized Recommendations**: AI-powered content recommendations based on user preferences and viewing history
- **Faceted Filtering**: Filter content by genre, release year, rating, and more
- **User Ratings & Reviews**: Rate and review movies and TV shows
- **Responsive UI**: Modern, responsive interface built with React and Tailwind CSS
- **Authentication**: User registration, login, and personalization for each user.

## Tech Stack

- **Backend**: Ruby on Rails with the [Typesense Rails Gem](https://github.com/typesense/typesense-rails)
- **Frontend**: Inertia.js with React, TypeScript, Tailwind CSS
- **Database**: Sqlite

## Installation

### Prerequisites

- Docker and Docker Compose
- Ruby (with Bundler)
- Node.js and npm/pnpm

### Setup Steps

#### 1. Get the Recommendations model

```bash
huggingface-cli download typesense/movie-recommendations-20m --local-dir ./movie-recommendations-model && cd movie-recommendations-model
```

```bash
tar -czvf ../movie-recommendations-model.tar.gz *.onnx vocab.txt prompts.json
```

#### 2. Install dependencies

```bash
# Install Node.js dependencies
npm install
# or if using pnpm
pnpm install

# Install or update Ruby dependencies
bundle install
```

#### 3. Start the Docker containers

```bash
docker compose up -d
```

This starts Typesense search server with the configuration defined in your `docker-compose.yml`.

#### 4. Set up the database

```bash
# Apply migrations
rails db:migrate
```

#### 5. Seed the database

```bash
# Seed user data
rake db:seed_users

# Import IMDB data
rake imdb:import

# Seed ratings data
rake imdb:seed_ratings

# Set up Typesense (search engine)
bundle exec rake typesense:setup
```

#### 6. Initialize search indices

```bash
# Open the Rails console
rails c

# Within the console, reindex all searchable models:
Movie.reindex!
Person.reindex!
TvShow.reindex!

# Movie relationships
MovieDirector.reindex!
MovieCast.reindex!
MovieWriter.reindex!

# TV Show relationships
TvShowDirector.reindex!
TvShowCast.reindex!
TvShowWriter.reindex!

# Exit the console
exit
```

#### 7. Start the development server

```bash
bin/dev
```

#### 8. Access the application

The application will be available at:

[http://localhost:3100](http://localhost:3100)

## Usage

### Searching for Movies and TV Shows

Use the search bar to find movies and TV shows by title, cast members, directors, or genres. 

### Browsing Content

Browse movies and TV shows by genre, release year, or rating. The application provides faceted navigation to help you discover new content.

### Personalized Recommendations

Once you create an account or use any of the pre-made ones and interact with the application by viewing or rating content, the system will start providing personalized recommendations based on your preferences and viewing history.

### Rating and Reviewing

After creating an account, you can rate movies and TV shows and leave reviews that are visible to other users.

## Configuration

### Environment Variables

The application uses the following environment variables that can be configured:

- `TYPESENSE_HOST`: Typesense server host (default: localhost)
- `TYPESENSE_PORT`: Typesense server port (default: 8108)
- `TYPESENSE_PROTOCOL`: Protocol to use for Typesense (default: http)
- `TYPESENSE_API_KEY`: API key for Typesense (default: xyz)

### Recommendation Models

The application uses a pre-trained recommendation model for personalized content suggestions. The model is loaded when you run `rake typesense:setup`.

## Development

### Project Structure

- `app/models`: Database models with Typesense integration
- `app/controllers`: Rails controllers handling requests and responses
- `app/frontend`: React components and pages
- `app/frontend/pages`: Main application pages
- `app/frontend/components`: Reusable UI components
- `lib/tasks`: Custom Rake tasks for importing data and setting up Typesense

### Typesense Integration

The integration includes:

- Searchable models with Typesense indexing
- Personalization model for recommendations
- Analytics rules for tracking user interactions
- Custom presets for different types of searches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
