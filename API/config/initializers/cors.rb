Rails.application.config.middleware.insert_before 0, Rack::CORS do
  allow do
    origins '*'
    resource '/api/*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
  end
end