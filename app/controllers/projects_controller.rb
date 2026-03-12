class ProjectsController < ApplicationController
  def index
    @projects = Project.recent
  end

  def show
    @project = Project.find_by_slug!(params[:slug])
  end
end
