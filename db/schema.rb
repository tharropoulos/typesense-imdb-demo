# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_02_27_153106) do
  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "genres", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "movie_casts", force: :cascade do |t|
    t.integer "movie_id", null: false
    t.integer "person_id", null: false
    t.string "character_name"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_movie_casts_on_movie_id"
    t.index ["person_id"], name: "index_movie_casts_on_person_id"
  end

  create_table "movie_countries", force: :cascade do |t|
    t.integer "movie_id", null: false
    t.integer "country_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_movie_countries_on_country_id"
    t.index ["movie_id"], name: "index_movie_countries_on_movie_id"
  end

  create_table "movie_directors", force: :cascade do |t|
    t.integer "movie_id", null: false
    t.integer "person_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_movie_directors_on_movie_id"
    t.index ["person_id"], name: "index_movie_directors_on_person_id"
  end

  create_table "movie_genres", force: :cascade do |t|
    t.integer "movie_id", null: false
    t.integer "genre_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_movie_genres_on_genre_id"
    t.index ["movie_id"], name: "index_movie_genres_on_movie_id"
  end

  create_table "movie_writers", force: :cascade do |t|
    t.integer "movie_id", null: false
    t.integer "person_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_movie_writers_on_movie_id"
    t.index ["person_id"], name: "index_movie_writers_on_person_id"
  end

  create_table "movies", force: :cascade do |t|
    t.string "movie_id", null: false
    t.string "title"
    t.string "original_title"
    t.text "description"
    t.string "content_rating"
    t.date "release_date"
    t.integer "runtime_minutes"
    t.decimal "average_rating", precision: 1, scale: 1
    t.integer "num_votes"
    t.decimal "budget", precision: 15, scale: 2
    t.decimal "gross_worldwide", precision: 15, scale: 2
    t.string "primary_image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "release_year"
    t.index ["movie_id"], name: "index_movies_on_movie_id", unique: true
  end

  create_table "people", force: :cascade do |t|
    t.string "person_id", null: false
    t.string "full_name"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_people_on_person_id", unique: true
  end

  create_table "ratings", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ratable_type", null: false
    t.integer "ratable_id", null: false
    t.decimal "score", precision: 2, scale: 1, null: false
    t.text "review", limit: 355
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ratable_type", "ratable_id"], name: "index_ratings_on_ratable"
    t.index ["user_id", "ratable_type", "ratable_id"], name: "idx_ratings_on_user_and_ratable", unique: true
    t.index ["user_id"], name: "index_ratings_on_user_id"
  end

  create_table "tv_show_casts", force: :cascade do |t|
    t.integer "tv_show_id", null: false
    t.integer "person_id", null: false
    t.string "character_name"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_tv_show_casts_on_person_id"
    t.index ["tv_show_id"], name: "index_tv_show_casts_on_tv_show_id"
  end

  create_table "tv_show_countries", force: :cascade do |t|
    t.integer "tv_show_id", null: false
    t.integer "country_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_tv_show_countries_on_country_id"
    t.index ["tv_show_id"], name: "index_tv_show_countries_on_tv_show_id"
  end

  create_table "tv_show_directors", force: :cascade do |t|
    t.integer "tv_show_id", null: false
    t.integer "person_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_tv_show_directors_on_person_id"
    t.index ["tv_show_id"], name: "index_tv_show_directors_on_tv_show_id"
  end

  create_table "tv_show_genres", force: :cascade do |t|
    t.integer "tv_show_id", null: false
    t.integer "genre_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_tv_show_genres_on_genre_id"
    t.index ["tv_show_id"], name: "index_tv_show_genres_on_tv_show_id"
  end

  create_table "tv_show_writers", force: :cascade do |t|
    t.integer "tv_show_id", null: false
    t.integer "person_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_tv_show_writers_on_person_id"
    t.index ["tv_show_id"], name: "index_tv_show_writers_on_tv_show_id"
  end

  create_table "tv_shows", force: :cascade do |t|
    t.string "show_id", null: false
    t.string "title"
    t.string "original_title"
    t.text "description"
    t.string "content_rating"
    t.decimal "average_rating", precision: 3, scale: 1
    t.integer "num_votes"
    t.string "primary_image_url"
    t.string "show_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "start_year"
    t.integer "end_year"
    t.integer "total_seasons"
    t.integer "total_episodes"
    t.index ["show_id"], name: "index_tv_shows_on_show_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "movie_casts", "movies"
  add_foreign_key "movie_casts", "people"
  add_foreign_key "movie_countries", "countries"
  add_foreign_key "movie_countries", "movies"
  add_foreign_key "movie_directors", "movies"
  add_foreign_key "movie_directors", "people"
  add_foreign_key "movie_genres", "genres"
  add_foreign_key "movie_genres", "movies"
  add_foreign_key "movie_writers", "movies"
  add_foreign_key "movie_writers", "people"
  add_foreign_key "ratings", "users"
  add_foreign_key "tv_show_casts", "people"
  add_foreign_key "tv_show_casts", "tv_shows"
  add_foreign_key "tv_show_countries", "countries"
  add_foreign_key "tv_show_countries", "tv_shows"
  add_foreign_key "tv_show_directors", "people"
  add_foreign_key "tv_show_directors", "tv_shows"
  add_foreign_key "tv_show_genres", "genres"
  add_foreign_key "tv_show_genres", "tv_shows"
  add_foreign_key "tv_show_writers", "people"
  add_foreign_key "tv_show_writers", "tv_shows"
end
