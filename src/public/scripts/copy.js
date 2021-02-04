;(function () {
  function copy() {
    const { hash } = this.dataset
    navigator.clipboard.writeText(hash).then(() => {
      this.classList.add('is-success')
      window.setTimeout(() => {
        this.classList.remove('is-success')
      }, 2000)
    })
  }

  const buttons = document.querySelectorAll('.copy-button')

  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state == 'granted' || result.state == 'prompt') {
      buttons.forEach((button) => {
        button.addEventListener('click', copy)
        button.classList.remove('is-hidden')
      })
    } else {
      buttons.forEach((button) => button.remove())
    }
  })
})()
