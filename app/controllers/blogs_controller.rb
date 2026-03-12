class BlogsController < ApplicationController
  def index
    @blogs = Blog.recent
  end

  def show
    @blog = Blog.find_by_slug!(params[:slug])
  end
end
