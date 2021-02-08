;(function () {
  const cells = document.querySelectorAll('.board-cell')
  const tickets = document.querySelectorAll('.board-ticket')

  for (const cell of cells) {
    cell.addEventListener('drop', (e) => {
      const projectId = cell.dataset.projectId
      const dropStatus = cell.dataset.dropStatus
      const dropPriority = cell.dataset.dropPriority
      const dragId = e.dataTransfer.getData('dragId')
      const dragStatus = e.dataTransfer.getData('dragStatus')
      const dragPriority = e.dataTransfer.getData('dragPriority')
      if (dragStatus !== dropStatus || dragPriority !== dropPriority) {
        saveTicket(dragId, projectId, dropStatus, dropPriority)
        // console.log(dragId, projectId, dropStatus, dropPriority)
      }
      cell.classList.remove('over')
    })

    let timeout

    cell.addEventListener('dragover', (e) => {
      e.preventDefault()
      cell.classList.add('over')
      clearTimeout(timeout)
    })

    cell.addEventListener('dragleave', (e) => {
      timeout = setTimeout(() => {
        cell.classList.remove('over')
      }, 10)
    })
  }

  for (const ticket of tickets) {
    ticket.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('dragId', ticket.dataset.dragId)
      e.dataTransfer.setData('dragStatus', ticket.dataset.dragStatus)
      e.dataTransfer.setData('dragPriority', ticket.dataset.dragPriority)
    })
  }

  function saveTicket(id, projectId, status, priority) {
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
