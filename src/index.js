$(document).ready(() => {
  loadItems()
})

const loadItems = () => {
  console.log('items loaded!')
}

class NewItem {
  constructor(name, purpose, quality) {
    this.name = name
    this.purpose = purpose
    this.quality = quality
    this.id = Date.now()
  }
}

$('.add-item-btn').on('click', () => {
  const name = $('.item-input').val()
  const purpose = $('.purpose-input').val()
  const quality = $('.cleanliness-selector').val()
  const item = new NewItem(name, purpose, quality)

  addItemToGarage(item)
})

const addItemToGarage = (item) => {
  displayInGarage(item)
  addToStorage(item)
}

const displayInGarage = (item) => {
  $('.item-list').append(`
    <li>${item.name}</li>
    `)
}

const addToStorage = (item) => {
  fetch('api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item })
  })
  .then(res => res.json())
  .then(items => console.log(items))
}
