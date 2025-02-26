Rails.application.routes.draw do
  devise_for :users, skip: [:sessions, :passwords, :registrations]
  as :user do
    get "login", to: "users/sessions#new", as: :new_user_session
    post "login", to: "users/sessions#create", as: :user_session
    match "logout", to: "users/sessions#destroy", as: :destroy_user_session, via: Devise.mappings[:user].sign_out_via

    get "signup", to: "users/registrations#new", as: :new_user_registration
    post "signup", to: "users/registrations#create", as: :user_registration
  end

  get "inertia-example", to: "inertia_example#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root to: "home#index"
end
