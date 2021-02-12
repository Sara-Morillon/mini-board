;(function () {
  const droppable = document.querySelectorAll('.drop-item')
  const draggable = document.querySelectorAll('.drag-item')

  for (const cell of droppable) {
    cell.addEventListener('drop', (e) => {
      const projectId = cell.dataset.projectId
      const dropStatus = cell.dataset.dropStatus
      const dropPriority = cell.dataset.dropPriority
      const dragId = e.dataTransfer.getData('dragId')
      const dragStatus = e.dataTransfer.getData('dragStatus')
      const dragPriority = e.dataTransfer.getData('dragPriority')
      if ((dropStatus && dragStatus !== dropStatus) || dragPriority !== dropPriority) {
        saveTicket(dragId, projectId, dropStatus, dropPriority)
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

  for (const ticket of draggable) {
    ticket.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('dragId', ticket.dataset.dragId)
      e.dataTransfer.setData('dragStatus', ticket.dataset.dragStatus)
      e.dataTransfer.setData('dragPriority', ticket.dataset.dragPriority)
      e.dataTransfer.setDragImage(document.getElementById(`drag-image-${ticket.dataset.dragId}`), 0, 0)
    })
  }

  function saveTicket(id, projectId, status, priority) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/project/${projectId}/issues/move/${id}`)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.addEventListener('load', function () {
      window.location.reload()
    })
    const body = new URLSearchParams()
    status && body.set('status', status)
    body.set('priority', priority)
    xhr.send(body)
  }
})()
