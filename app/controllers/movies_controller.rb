class MoviesController < ApplicationController
  include Breadcrumbs

  def show
    movie = Movie.find(params[:id])
    all_genres = movie.genres.map { |genre| genre[:name] }.compact

    primary_director = movie.movie_directors.first.person_id
    suggestions = suggestions(movie.id, primary_director, all_genres)

    add_breadcrumb("Movies", "/movies")
    add_breadcrumb(movie.title)

    render inertia: "Movie/Show", props: {
             movie: MoviePresenter.new(movie).as_json,
             suggestions: suggestions,
             breadcrumbs: @breadcrumbs,
           }
  end

  def index
    add_breadcrumb("Movies", "/movies")
    render inertia: "Movie/Index", props: {
      breadcrumbs: @breadcrumbs,
    }
  end

  private

  def suggestions(current_movie_id, director_id, genres, limit = 6)
    genre_filter = "genres:[#{genres.join(", ")}]"
    primary_genre = genres.first
    secondary_genre = genres.size > 1 ? genres.second : nil

    sort_by = if genres.size > 1
        "_eval([((primary_genre:#{primary_genre} && secondary_genre:#{secondary_genre} && num_votes:>10000) || (primary_genre:#{secondary_genre} && secondary_genre:#{primary_genre} && num_votes:>10000)):4, (average_rating:>8.0 && num_votes:>10000 && primary_genre:#{primary_genre}):3, (average_rating:>8.0 && secondary_genre:#{secondary_genre}):2 ]):desc"
      else
        "_eval([(average_rating:>8.0 && num_votes:>10000 && primary_genre:#{primary_genre}):3]):desc"
      end
    from_director_params = {
      filter_by: "$MovieDirector(person_id: #{director_id}) && id:!=#{current_movie_id}",
      sort_by: "average_rating:desc, num_votes:desc, release_year:desc",
      include_fields: "title, average_rating, primary_image_url, release_year, id, genres, ",
      per_page: 15,
    }

    similar_to_params = {
      filter_by: "#{genre_filter} && id:!=#{current_movie_id}",
      sort_by: "#{sort_by}, average_rating:desc, num_votes:desc",
      include_fields: "title, average_rating, primary_image_url, release_year, id, genres, collection_type",
      per_page: 15,
    }

    from_director = Movie.raw_search("*", "", from_director_params)["hits"].map { |hit| hit["document"] }
    similar_to = Movie.raw_search("*", "", similar_to_params)["hits"].map { |hit| hit["document"] }

    {
      from_director: from_director,
      similar_to: similar_to,
    }
  end
end
