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

app.get('/', (request, response) => {
  fs.readFile(`${_dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})


//
// app.get('/api/v1/folders', (request, response) => {
//   database('folders').select()
//     .then((folders) => {
//       response.status(200).json(folders);
//     })
//     .catch(function(error) {
//       console.error('somethings wrong with db')
//       console.log(error)
//     });
// })
//
// app.get('/api/v1/folders/:id', (request, response) => {
//   const { id } = request.params;
//   database('urls').where('folder_id', id).select()
//     .then((urlData) => {
//       response.status(201).json(urlData)
//     })
//     .catch((error)=>{
//       response.status(422).send({
//         error: 'ID did not match any existing folders'
//       })
//     })
// })
//
// app.post('/api/v1/folders', (request, response) => {
//   const { folder } = request.body
//   const newFolder = { name: folder }
//
//   database('folders').insert(newFolder)
//   .then(()=> {
//     database('folders').select()
//       .then((folders) => {
//         response.status(200).json(folders);
//       })
//       .catch((error) => {
//         console.error('somethings wrong with db')
//       });
//   })
// })
//
// app.post('/api/v1/folders/:id', (request, response) => {
//   const { id } = request.params
//   const { longURL } = request.body
//
//   const shortURL = md5(longURL).slice(0, 5)
//   const newURLObject = {
//     longURL,
//     shortURL,
//     visitCount: 0,
//     created_at: JSON.stringify(Date.now()),
//     folder_id: id
//   }
//
//   database('urls').insert(newURLObject)
//   .then(()=> {
//     database('urls').where('folder_id', id).select()
//     .then((urlData) => {
//       response.status(201).json(urlData)
//     })
//     .catch((error)=>{
//       response.status(422).json(
//         error
//         // error: 'ID did not match any existing folders'
//       )
//     })
//   })
// })
//
// app.get(`/:shortURL`, (request, response) => {
//   const { shortURL } = request.params;
//   let longURL;
//   let visits;
//
//   database('urls').where('shortURL', shortURL).select()
//   .then((url)=>{
//     longURL = (url[0].longURL)
//     visits = (url[0].visitCount) + 1
//   })
//   .then(()=>{
//     database('urls').where('shortURL', shortURL).update({ visitCount: visits })
//     .then(()=>{
//       response.status(302).redirect(`${longURL}`);
//     })
//   })
//   .catch((error)=>{
//     response.status(422).send({
//       error: 'nope'
//     })
//   })
// })
//
// app.put(`/:shortURL`, (request, response) => {
//   const { shortURL } = request.params;
//   let visits;
//
//   database('urls').where('shortURL', shortURL).select()
//   .then((url) => {
//     visits = (url[0].visitCount) + 1
//   })
//   .then(() => {
//     database('urls').where('shortURL', shortURL).update({ visitCount: visits })
//     .then(() => {
//       response.status(200);
//     })
//   })
//
// })

if(!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`It\'s lit AF over at ${app.get('port')}`);
  })
}

module.exports = app;
