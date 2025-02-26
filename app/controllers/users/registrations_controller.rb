class Users::RegistrationsController < Devise::RegistrationsController
  include InertiaRails::Controller

  def new
    self.resource = resource_class.new
    render inertia: "Auth/Signup", props: {}
  end

  def create
    build_resource(sign_up_params)

    if resource.save
      sign_up(resource_name, resource)
      redirect_to root_path, notice: "Welcome! You have signed up successfully."
    else
      set_flash_message!(:alert, :invalid)
      render inertia: "Auth/Signup", props: {
        errors: resource.errors.messages,
      }
    end
  end
end
