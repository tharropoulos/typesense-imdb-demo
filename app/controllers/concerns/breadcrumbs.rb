module Breadcrumbs
  extend ActiveSupport::Concern

  included do
    before_action :initialize_breadcrumbs
    helper_method :add_breadcrumb
  end

  def initialize_breadcrumbs
    @breadcrumbs = []
    add_breadcrumb("Home", "/")
  end

  def add_breadcrumb(label, url = nil)
    @breadcrumbs << { label: label, url: url }
  end

  def render_with_breadcrumbs(component, props = {})
    render inertia: component, props: props.merge(breadcrumbs: @breadcrumbs)
  end
end
