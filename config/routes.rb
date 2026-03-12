Rails.application.routes.draw do
  # 首页
  root "pages#home"

  # 静态页面
  get "terminal", to: "pages#terminal"
  get "about", to: "pages#about"
  get "resource", to: "pages#resource"
  get "wechat", to: "pages#wechat"

  # 博客
  resources :blogs, only: [ :index, :show ], param: :slug, path: "blog"

  # 项目
  resources :projects, only: [ :index, :show ], param: :slug, path: "project"

  # AI chat proxy
  post "api/chat", to: "api/chat#create", as: :api_chat

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
