;(function () {
  const branchSelect = document.querySelector('.branch-select')

  if (branchSelect) {
    branchSelect.addEventListener('change', (e) => {
      const [option] = e.target.selectedOptions
      location.assign(option.dataset.href)
    })
  }
})()
