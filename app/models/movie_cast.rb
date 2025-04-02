class MovieCast < ApplicationRecord
  include Typesense
  belongs_to :movie
  belongs_to :person

  typesense do
    predefined_fields [
      { "name" => "movie_id", "type" => "string", "reference" => "Movie.id" },
      { "name" => "person_id", "type" => "string", "reference" => "Person.id" },
      { "name" => "character_name", "type" => "string" },
      { "name" => "role", "type" => "string", "index" => false },
    ]
    attribute :id, :movie_id, :person_id, :character_name, :role
    attribute :movie_id do
      self.movie.id.to_s if self.movie.present?
    end
    attribute :person_id do
      self.person.id.to_s if self.person.present?
    end
  end
end
