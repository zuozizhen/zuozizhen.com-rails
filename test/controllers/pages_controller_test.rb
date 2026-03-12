require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get pages_home_url
    assert_response :success
  end

  test "should get about" do
    get pages_about_url
    assert_response :success
  end

  test "should get resource" do
    get pages_resource_url
    assert_response :success
  end

  test "should get wechat" do
    get pages_wechat_url
    assert_response :success
  end
end
