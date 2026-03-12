import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["email", "button", "loader", "text", "error"]

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  async submit(event) {
    event.preventDefault()
    
    this.errorTarget.classList.add("hidden")
    
    if (!this.validateEmail(this.emailTarget.value)) {
      this.errorTarget.classList.remove("hidden")
      return
    }

    this.loaderTarget.classList.remove("hidden")
    this.textTarget.classList.add("hidden")

    try {
      const response = await fetch(
        "https://subscribers-email-to-notion.jingmiaofenxiang.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email: this.emailTarget.value, 
            website: "zuozizhen.com" 
          }),
        }
      )

      if (response.ok) {
        alert("订阅成功！感谢您的订阅。")
        this.emailTarget.value = ""
      } else {
        alert("订阅失败，错误代码：" + response.status)
      }
    } catch (error) {
      console.error("订阅请求出错：", error)
      alert("订阅请求出错，请稍后再试。")
    } finally {
      this.loaderTarget.classList.add("hidden")
      this.textTarget.classList.remove("hidden")
    }
  }
}
