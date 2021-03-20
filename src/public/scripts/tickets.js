;(function () {
  const draggable = document.querySelectorAll('[draggable]')
  const droppable = document.querySelectorAll('[data-droppable]')

  function shouldSave(dragItem, dropTarget) {
    return (
      dragItem.releaseId !== dropTarget.releaseId ||
      (dropTarget.status && dragItem.status !== dropTarget.status) ||
      dragItem.priority !== dropTarget.priority
    )
  }

  for (const cell of droppable) {
    cell.addEventListener('drop', (e) => {
      const dragItem = JSON.parse(e.dataTransfer.getData('dragItem'))
      const dropTarget = JSON.parse(cell.dataset.dropTarget)
      if (shouldSave(dragItem, dropTarget)) {
        saveTicket(dragItem, dropTarget)
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
      e.dataTransfer.setData('dragItem', ticket.dataset.dragItem)
    })
  }

  function saveTicket(dragItem, dropTarget) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/project/${dragItem.projectId}/issues/move/${dragItem.id}`)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.addEventListener('load', function () {
      window.location.reload()
    })
    const body = new URLSearchParams()
    dropTarget.status && body.set('status', dropTarget.status)
    body.set('priority', dropTarget.priority)
    body.set('release', dropTarget.releaseId)
    xhr.send(body)
  }
})()
