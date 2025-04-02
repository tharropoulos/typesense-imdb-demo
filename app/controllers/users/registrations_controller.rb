class Users::RegistrationsController < Devise::RegistrationsController
  include InertiaRails::Controller

  def new
    self.resource = resource_class.new
    render inertia: "Auth/Signup", props: {
      errors: {},
    }
  end

  def create
    build_resource(sign_up_params)

    if resource.save
      sign_up(resource_name, resource)
      redirect_to after_sign_up_path_for(resource), notice: "Welcome! You have signed up successfully."
    else
      clean_up_passwords resource
      render inertia: "Auth/Signup", props: {
        auth: nil,
        errors: resource.errors.messages,
        formData: sign_up_params.except(:password, :password_confirmation),
      }
    end
  end

  protected

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :username)
  end

  def after_sign_up_path_for(resource)
    stored_location_for(resource) || root_path
  end
end
