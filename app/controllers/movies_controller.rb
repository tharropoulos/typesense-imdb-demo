class MoviesController < ApplicationController
  include Breadcrumbs

  def show
    movie = Movie.find(params[:id])
    all_genres = movie.genres.map { |genre| genre[:name] }.compact

    primary_director = movie.movie_directors.first.person_id
    add_breadcrumb("Movies", "/movies")
    add_breadcrumb(movie.title)

    render inertia: "Movie/Show", props: {
             movie: MoviePresenter.new(movie).as_json,
             breadcrumbs: @breadcrumbs,
           }
  end

  def index
    add_breadcrumb("Movies", "/movies")
    render inertia: "Movie/Index", props: {
      breadcrumbs: @breadcrumbs,
    }
  end
end
