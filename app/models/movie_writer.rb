class MovieWriter < ApplicationRecord
  include Typesense
  belongs_to :movie
  belongs_to :person

  typesense do
    predefined_fields [
      { "name" => "movie_id", "type" => "string", "reference" => "Movie.id" },
      { "name" => "person_id", "type" => "string", "reference" => "Person.id" },
    ]

    attribute :id, :movie_id, :person_id

    attribute :movie_id do
      self.movie.id.to_s if self.movie.present?
    end

    attribute :person_id do
      self.person.id.to_s if self.person
    end
  end
end
