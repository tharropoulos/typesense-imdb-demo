class Users::SessionsController < Devise::SessionsController
  layout "application"

  respond_to :html, :json

  def new
    self.resource = resource_class.new
    render inertia: "Auth/Login"
  end

  def create
    self.resource = warden.authenticate(auth_options)

    if resource
      sign_in(resource_name, resource)
      respond_with resource, location: after_sign_in_path_for(resource)
    else
      render inertia: "Auth/Login", props: {
        errors: { base: ["Invalid email or password"] },
        values: { email: params.dig(:user, :email) },
      }, status: :unprocessable_entity
    end
  end

  protected

  def after_sign_in_path_for(resource)
    stored_location_for(resource) || root_path
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
end
