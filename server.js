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


//
app.get('/api/v1/items', (request, response) => {
  response.status(200).send(app.locals.items)
})

app.post('/api/v1/items', (request, response) => {
  const { item } = request.body
  const { items } = app.locals

  if(item) {
    items.push(item)
    response.status(200).send(items)
  } else {
    response.status(404).send({ error: 'Item could not be saved'})
  }
})

if(!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`It\'s lit AF over at ${app.get('port')}`);
  })
}

module.exports = app;
