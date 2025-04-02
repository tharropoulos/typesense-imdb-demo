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
end
