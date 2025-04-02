class TvShowsController < ApplicationController
  include Breadcrumbs


  def show
    tv_show = TvShow.find(params[:id])
    all_genres = tv_show.genres.map { |genre| genre[:name] }.compact

    primary_director = tv_show.tv_show_directors.first.id
    add_breadcrumb("TV", "/tv_shows")
    add_breadcrumb(tv_show.title)

    render inertia: "TvShow/Show", props: {
             tv_show: TvShowPresenter.new(tv_show).as_json,
             breadcrumbs: @breadcrumbs,
           }
  end

    add_breadcrumb("TV", "/tv_shows")
end
