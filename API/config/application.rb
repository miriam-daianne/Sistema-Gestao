require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie" # Uncomment if using assets
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module Api
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
  end
end
