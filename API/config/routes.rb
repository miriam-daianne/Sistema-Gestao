Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :consultas, only: [:index, :create] do
        collection do
          post :create_orcamento
          get :dashboard
        end
      end

      resources :tratamentos, only: [:index, :create] do
        collection do
          get :stats
        end
      end

      resources :clientes, only: [:index, :create]
      resources :comissoes, only: [:index]
      resources :pacientes, only: [:index, :create]
      resources :profissionais, only: [:index, :create]
    end
  end
end