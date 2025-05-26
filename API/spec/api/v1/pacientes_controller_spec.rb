require_relative '../../rails_helper'
require_relative '../../../app/controllers/api/v1/pacientes_controller'

RSpec.describe 'Api::V1::Pacientes', type: :request do
  describe 'GET #index' do
    it 'returns 200 OK' do
      get '/api/v1/pacientes'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST #create' do
    it 'creates a new paciente' do
      post '/api/v1/pacientes', params: { paciente: { nome: 'Test', cpf: '12345678900', telefone: '123456789', email: 'test@example.com', nascimento: '2000-01-01' } }
      expect(response).to have_http_status(:created)
    end
  end
end
