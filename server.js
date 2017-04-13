const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));

app.set('port', process.env.PORT || 3000);

app.locals.items = [];

app.get('/', (request, response) => {
  fs.readFile(`${_dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.get('/api/v1/items', (request, response) => {
  const { items } = app.locals
  if(items) {
    response.status(200).send(app.locals.items)
  } else {
    response.status(404).send({ error: 'Unable to find what you\'re looking for' })
  }
})

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  const currentItem = app.locals.items.find(item => item.id == parseInt(id))

  if(currentItem) {
    response.status(200).send(currentItem)
  } else {
    response.status(404).send({ error: 'Item not found'})
  }
})

app.post('/api/v1/items', (request, response) => {
  const { item } = request.body
  const { items } = app.locals

  if(item) {
    items.push(item)
    response.status(200).send(items)
  } else {
    response.status(400).send({ error: 'Item was not saved'})
  }
})

app.put('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  const { updatedItem } = request.body
  const updated = app.locals.items.map(item => {
    if(item.id === parseInt(id)) {
      item = updatedItem
    }
    return item
  })

  if(updated.length > 0) {
    app.locals.items = updated
    response.status(200).send(app.locals.items)
  } else {
    response.status(400).send({ error: 'Item was not saved'})
  }
})

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  const updated = app.locals.items.filter(item => {
    return item.id !== parseInt(id)
  })
  if(updated) {
    app.locals.items = updated
    response.status(200).send(app.locals.items)
  } else {
    response.status(400).send({ error: 'item was not deleted' })
  }
})

if(!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`It\'s lit AF over at ${app.get('port')}`);
  })
}

module.exports = app;
