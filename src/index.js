let stats = { sparkling: 0, dusty: 0, rancid: 0}
const quality = ['sparkling', 'dusty', 'rancid']
let showModal = false
let allItems = []
let sortToggle = false
let garageClosed = true

$(document).ready(() => {
  loadItems()
})

const loadItems = () => {
  fetch('/api/v1/items')
  .then(res => res.json())
  .then(items => reRenderAllItems(items))
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

    addToStorage(item)
    resetInputs()
  }
}

const displayInGarage = (item) => {
  $('.item-list').append(`
    <li class='item' id='${item.id}'>${item.name}</li>
  `)
}

const addToStorage = (item) => {
  fetch('api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  })
  .then(res => res.json())
  .then(items => reRenderAllItems(items))
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

$('.item-list').on('click', '.item', (e) => {
  const itemID = e.target.id
  toggleModal()
  getItemData(itemID)
})

const getItemData = (id) => {
  fetch(`/api/v1/items/${id}`)
  .then(res => res.json())
  .then(item => displayOnModal(item))
}

const displayOnModal = (item) => {
  $('.modal-name').text(item.name)
  $('.modal-purpose').text(item.purpose)
  $('.modal-selector').val(item.quality)
  $('.modal').attr('id', item.id)
}

$('.modal-save-btn').on('click', (e) => {
  const name = $('.modal-name').text()
  const purpose = $('.modal-purpose').text()
  const quality = $('.modal-selector').val()
  const id = parseInt(e.target.closest('.modal').id)
  const item = { id, name, purpose, quality }
  updateItem(item)
  toggleModal()
})

const updateItem = (item) => {
  fetch(`/api/v1/items/${item.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({updatedItem: item})
  })
  .then(res => res.json())
  .then(items => reRenderAllItems(items))
}

const toggleModal = () => {
  if(!showModal) {
    $('.modal').removeClass('hidden')
    showModal = true
  } else {
    $('.modal').addClass('hidden')
    showModal = false
    resetModal()
  }
}

const resetModal = () => {
  $('.modal').attr('id', '')
  $('.modal-name').text('')
  $('.modal-name').text('')
}

const reRenderAllItems = (items) => {
  allItems = items
  $('.item-list').empty()
  items.forEach(item => {
    displayInGarage(item)
  })
  updateStats(items)
}

const updateStats = (items) => {
  stats = { sparkling: 0, dusty: 0, rancid: 0}
  items.forEach(item => {
    stats[item.quality]++
  })

  Object.keys(stats).forEach(stat => {
    $(`.number-of-${stat}`).text('')
    $(`.number-of-${stat}`).text(stats[stat])
  })

  const total = Object.keys(stats).reduce((sum, stat) => {
    sum += stats[stat]
    return sum
  }, 0)

  $('.total-items').text(total)
}

$('.modal-delete-btn').on('click', (e) => {
  const id = parseInt(e.target.closest('.modal').id)
  deleteItem(id)
})

const deleteItem = (id) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(items => reRenderAllItems(items))
  toggleModal()
}

$('.sort-items-btn').on('click', () => {
  if(allItems.length > 0) {
    if(!sortToggle) {
      reRenderAllItems(sortABC(allItems))
      sortToggle = !sortToggle
      $('.sort-items-btn').text('Sort Z-A')
    } else {
      reRenderAllItems(sortCBA(allItems))
      sortToggle = !sortToggle
      $('.sort-items-btn').text('Sort A-Z')
    }
  }
})

$('.open-garage-btn').on('click', () => {
  if(garageClosed) {
    $('.garage-door').removeClass('slideDown')
    $('.garage-door').addClass('slideUp')
    garageClose = false
  }
})

$('.close-garage-btn').on('click', () => {
  $('.garage-door').removeClass('slideUp')
  $('.garage-door').addClass('slideDown')
  garageClose = true
})

$('.close-modal-btn').on('click', () => {
  toggleModal()
})
