class TvShowWriter < ApplicationRecord
  include Typesense
  belongs_to :tv_show
  belongs_to :person

  typesense do
    predefined_fields [
      { "name" => "tv_show_id", "type" => "string", "reference" => "TvShow.id" },
      { "name" => "person_id", "type" => "string", "reference" => "Person.id" },
    ]

    attribute :id, :tv_show_id, :person_id

    attribute :tv_show_id do
      self.tv_show.id.to_s if self.tv_show.present?
    end

    attribute :person_id do
      self.person.id.to_s if self.person
    end
  end
end
