let stats = { sparkling: 0, dusty: 0, rancid: 0}
let quality = ['sparkling', 'dusty', 'rancid']

$(document).ready(() => {
  loadItems()
})

const loadItems = () => {
  fetch('/api/v1/items')
  .then(res => res.json())
  .then(items => {
    items.forEach(item => {
      displayInGarage(item)
      stats[item.quality]++
      updateStats()
    })
  })
}

const updateStats = () => {
  Object.keys(stats).forEach(stat => {
    $(`.number-of-${stat}`).text(stats[stat])
  })

  const total = Object.keys(stats).reduce((sum, stat) => {
    sum += stats[stat]
    return sum
  }, 0)

  $('.total-items').text(total)
}

class NewItem {
  constructor(name, purpose, quality) {
    this.name = name
    this.purpose = purpose
    this.quality = quality
    this.id = Date.now()
  }
}

const checkInputs = () => {
  return $('.item-input').val() && $('.purpose-input').val() ? true : false
}

const resetInputs = () => {
  $('.item-input').val('')
  $('.purpose-input').val('')
  $('.cleanliness-selector').val(quality[1])
}

$('.add-item-btn').on('click', () => {
  submitItem()
})

const submitItem = () => {
  if(checkInputs()) {
    const name = $('.item-input').val()
    const purpose = $('.purpose-input').val()
    const quality = $('.cleanliness-selector').val()
    const item = new NewItem(name, purpose, quality)

    addItemToGarage(item)
    resetInputs()
  }
}

const addItemToGarage = (item) => {
  displayInGarage(item)
  addToStorage(item)
}

const displayInGarage = (item) => {
  $('.item-list').append(`
    <li class='item'>${item.name}</li>
    `)
}

const addToStorage = (item) => {
  fetch('api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  })
  .then(res => res.json())
  .then(items => {
    $('.item-list').empty()
    items.forEach(item => displayInGarage(item))
  })
}

const enableButton = () => {
  $('.add-item-btn').prop('disabled', false)
}

const disableButton = () => {
  $('.add-item-btn').prop('disabled', true)
}

$('.add-item-input').on('keyup', () => {
  return checkInputs() ? enableButton() : disableButton()
})

$('.add-item-input').on('keydown', (e) => {
  if(e.keyCode === 13) {
    submitItem()
  }
})
