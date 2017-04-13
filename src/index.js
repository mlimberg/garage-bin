$(document).ready(() => {
  loadItems()
})

const loadItems = () => {
  fetch('/api/v1/items')
  .then(res => res.json())
  .then(items => {
    console.log(items);
    items.forEach(item => displayInGarage(item))
  })
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

$('.add-item-btn').on('click', () => {
  if(checkInputs()) {
    console.log('yup!');
    const name = $('.item-input').val()
    const purpose = $('.purpose-input').val()
    const quality = $('.cleanliness-selector').val()
    const item = new NewItem(name, purpose, quality)

    addItemToGarage(item)
  }
})

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
  .then(items => localStorage.setItem('items', JSON.stringify(items)))
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
