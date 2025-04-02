class ApplicationController < ActionController::Base
  include InertiaCsrf

  def render_inertia(component, props = {})
    render inertia: component, props: props.merge(breadcrumbs: @breadcrumbs)
  end

  inertia_share auth: -> {
                  if user_signed_in?
                    {
                      user: {
                        id: current_user.id,
                        email: current_user.email,
                      },
                    }
                  end
                }

  rescue_from StandardError, with: :inertia_error_page

  private

  def inertia_error_page(exception)
    raise exception if Rails.env.local?
    status = ActionDispatch::ExceptionWrapper.new(nil, exception).status_code
    render inertia: "Error", props: { status: }, status:
  end
end
