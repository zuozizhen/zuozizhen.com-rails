# frozen_string_literal: true

class Project
  include ActiveModel::Model
  include ActiveModel::Naming
  include FileBackedModel

  content_directory "content/project"

  def duty
    attributes["duty"]
  end
end
