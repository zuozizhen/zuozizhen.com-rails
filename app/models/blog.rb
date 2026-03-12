# frozen_string_literal: true

class Blog
  include ActiveModel::Model
  include ActiveModel::Naming
  include FileBackedModel

  content_directory "content/blog"
end
