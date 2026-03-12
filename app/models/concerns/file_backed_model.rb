# frozen_string_literal: true

# FileBackedModel provides a base for models that read content from Markdown files
# instead of a database. Each file has YAML frontmatter and a Markdown body.
#
# Usage:
#   class Blog
#     include FileBackedModel
#     content_directory "content/blog"
#   end
#
module FileBackedModel
  extend ActiveSupport::Concern

  included do
    class_attribute :_content_directory
  end

  class_methods do
    def content_directory(path)
      self._content_directory = Rails.root.join(path)
    end

    def all
      if Rails.env.development?
        load_all
      else
        @_all ||= load_all
      end
    end

    def reload!
      @_all = nil
    end

    def published
      all.select { |item| !item.draft && item.published_at && item.published_at <= Time.current }
    end

    def recent
      published.sort_by { |item| item.published_at }.reverse
    end

    def find_by_slug(slug)
      all.find { |item| item.slug == slug }
    end

    def find_by_slug!(slug)
      find_by_slug(slug) || raise(ActiveRecord::RecordNotFound, "Couldn't find #{name} with slug '#{slug}'")
    end

    private

    def load_all
      Dir.glob(_content_directory.join("*.md")).map do |filepath|
        parse_file(filepath)
      end
    end

    def parse_file(filepath)
      raw = File.read(filepath)
      match = raw.match(/\A---\s*\n(.*?)\n---\s*\n(.*)/m)
      return nil unless match

      frontmatter = YAML.safe_load(match[1], permitted_classes: [Date, Time]) || {}
      body = match[2]
      slug = File.basename(filepath, ".md")

      new(frontmatter.merge("slug" => slug, "content" => body))
    end
  end

  attr_reader :attributes

  def initialize(attrs = {})
    @attributes = attrs.stringify_keys
  end

  def slug
    attributes["slug"]
  end

  def title
    attributes["title"]
  end

  def snippet
    attributes["snippet"]
  end

  def image_url
    attributes["image"]
  end

  def draft
    attributes["draft"] || false
  end

  def content
    attributes["content"]
  end

  def published_at
    value = attributes["published_at"]
    case value
    when Time, DateTime then value
    when Date then value.to_time
    when String then Time.parse(value) rescue nil
    else nil
    end
  end

  def to_param
    slug
  end

  def formatted_date
    published_at&.strftime("%Y年%m月%d日")
  end

  def year
    published_at&.year
  end

  def rendered_content
    return "" if content.blank?
    markdown = Redcarpet::Markdown.new(
      Redcarpet::Render::HTML.new(
        hard_wrap: true,
        link_attributes: { target: "_blank" }
      ),
      autolink: true,
      tables: true,
      fenced_code_blocks: true,
      strikethrough: true
    )
    markdown.render(content).html_safe
  end

  # For Rails path helpers
  def persisted?
    true
  end

  def model_name
    self.class.model_name
  end
end
