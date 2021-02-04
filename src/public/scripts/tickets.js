;(function () {
  const cells = document.querySelectorAll('.board-cell')
  const tickets = document.querySelectorAll('.board-ticket')

  for (const cell of cells) {
    cell.addEventListener('drop', (e) => {
      const id = e.dataTransfer.getData('id')
      saveTicket(cell, id)
    })

    cell.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
  }

  for (const ticket of tickets) {
    ticket.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('id', e.target.dataset.id)
    })
  }

  function saveTicket(cell, id) {
    const projectId = cell.dataset.projectid
    const status = cell.dataset.status
    const priority = cell.dataset.priority
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/project/${projectId}/issues/move/${id}`)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.addEventListener('load', function () {
      window.location.reload()
    })
    const formData = new FormData()
    formData.set('status', status)
    formData.set('priority', priority)
    xhr.send(`status=${status}&priority=${priority}`)
  }
})()
