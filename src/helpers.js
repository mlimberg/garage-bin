const sortABC = (items) => {
  return items.sort((itemA, itemB) => {
    return itemA.name > itemB.name
  })
}

const sortCBA = (items) => {
  return items.sort((itemA, itemB) => {
    return itemB.name > itemA.name
  })
}
