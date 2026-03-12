class PagesController < ApplicationController
  def home
    @blogs = Blog.recent.first(2)
    @projects = Project.recent
  end

  def terminal
    @blogs = Blog.recent.first(2)
    @projects = Project.recent
    render layout: "terminal"
  end

  def about
  end

  def resource
  end

  def wechat
  end
end
