Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :clientes, only: [:index, :create]
      resources :tratamentos, only: [:index, :create] do
        collection do
          get :stats
        end
      end
      resources :profissionais, only: [:index, :create]
      resources :pacientes, only: [:index, :create]
      resources :consultas, only: [:index, :create] do
        collection do
          get :dashboard
        end
      end
      resources :comissoes, only: [:index]
    end
  end
end