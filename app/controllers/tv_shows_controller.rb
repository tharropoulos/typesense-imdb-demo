class TvShowsController < ApplicationController
  include Breadcrumbs


  def show
    tv_show = TvShow.find(params[:id])
    all_genres = tv_show.genres.map { |genre| genre[:name] }.compact

    primary_director = tv_show.tv_show_directors.first.id
    suggestions = suggestions(tv_show.id, primary_director, all_genres)

    add_breadcrumb("TV", "/tv_shows")
    add_breadcrumb(tv_show.title)

    render inertia: "TvShow/Show", props: {
             tv_show: TvShowPresenter.new(tv_show).as_json,
             suggestions: suggestions,
             breadcrumbs: @breadcrumbs,
           }
  end

  def index
    add_breadcrumb("TV", "/tv_shows")
    render inertia: "TvShow/Index", props: {
      breadcrumbs: @breadcrumbs,
    }
  end

  private

  def suggestions(current_tv_show_id, director_id, genres, limit = 6)
    genre_filter = "genres:[#{genres.join(", ")}]"
    primary_genre = genres.first
    secondary_genre = genres.size > 1 ? genres.second : nil

    sort_by = if genres.size > 1
        "_eval([((primary_genre:#{primary_genre} && secondary_genre:#{secondary_genre} && num_votes:>10000) || (primary_genre:#{secondary_genre} && secondary_genre:#{primary_genre} && num_votes:>10000)):4, (average_rating:>8.0 && num_votes:>10000 && primary_genre:#{primary_genre}):3, (average_rating:>8.0 && secondary_genre:#{secondary_genre}):2 ]):desc"
      else
        "_eval([(average_rating:>8.0 && num_votes:>10000 && primary_genre:#{primary_genre}):3]):desc"
      end

    from_director_params = {
      filter_by: "$TvShowDirector(person_id: #{director_id}) && id:!=#{current_tv_show_id}",
      sort_by: "average_rating:desc, num_votes:desc, start_year:desc",
      include_fields: "title, average_rating, primary_image_url, start_year, id, genres, total_seasons",
      per_page: 15,
    }

    similar_to_params = {
      filter_by: "#{genre_filter} && id:!=#{current_tv_show_id}",
      sort_by: "#{sort_by}, average_rating:desc, num_votes:desc",
      include_fields: "title, average_rating, primary_image_url, start_year, id, genres, total_seasons",
      per_page: 15,
    }

    similar_to = TvShow.raw_search("*", "", similar_to_params)["hits"].map { |hit| hit["document"] }
    from_director = TvShow.raw_search("*", "", from_director_params)["hits"].map { |hit| hit["document"] }

    {
      from_director: from_director,
      similar_to: similar_to,
    }
  end
end
