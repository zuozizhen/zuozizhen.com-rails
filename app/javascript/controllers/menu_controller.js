import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fullscreen"]

  toggle() {
    const menu = this.fullscreenTarget
    if (menu.classList.contains("invisible")) {
      menu.classList.remove("invisible")
      setTimeout(() => {
        menu.style.opacity = "1"
        document.body.style.overflow = "hidden"
      }, 10)
    } else {
      menu.style.opacity = "0"
      setTimeout(() => {
        menu.classList.add("invisible")
        document.body.style.overflow = ""
      }, 300)
    }
  }

  close(event) {
    if (event.target === this.fullscreenTarget) {
      this.toggle()
    }
  }
}
