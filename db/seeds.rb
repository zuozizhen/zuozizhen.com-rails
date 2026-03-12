# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Blog and Project content is now file-driven.
# Simply create .md files in content/blog/ or content/project/ to add new content.
#
# Example:
#   content/blog/my-new-post.md
#   ---
#   draft: false
#   title: "My New Post"
#   snippet: "A short description"
#   image: "https://example.com/image.jpg"
#   published_at: "2026-02-10"
#   ---
#   Your markdown content here...

puts "No database seeds needed — content is file-driven!"
puts "Blog posts: #{Blog.all.size} files in content/blog/"
puts "Projects: #{Project.all.size} files in content/project/"
