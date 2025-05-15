class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  
  private
  
  def not_found
    render json: { error: 'Registro não encontrado' }, status: :not_found
  end
  
  def parameter_missing(e)
    render json: { error: e.message }, status: :unprocessable_entity
  end
end