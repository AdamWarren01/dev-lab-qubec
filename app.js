require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const { ObjectId } = require('mongodb')

//dotenv.config({path:'config.env'});

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(express.static('public'));

console.log(process.env.MONGO_URI);

MongoClient.connect(process.env.MONGO_URI, { 
    useUnifiedTopology: true}) 
    .then(client =>{
      console.log('connected to db')
      const db = client.db('movies')
      const filmsCollection = db.collection('films')  
      
      app.get('/', async (req, res) => {

        console.log("here in /get");

          await db.collection('films').find().toArray()
          .then(results => {
            console.log("results:" , results);
           //res.send("here");
            res.render('index.ejs', { films: results})
          })
          .catch(error => console.error(error))
        // res.render('index.ejs', {})  
      })

      app.get('/movies', (req, res) => {
        db.collection('films').find().toArray()
          .then(results => {
            res.render('index.ejs', { films: results})
          })
          .catch(error => console.error(error))
        // res.render('index.ejs', {})  
      })

      app.post('/films', (req, res) => {
        filmsCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

      app.post('/films', (req,res) => {
          console.log(req.body);
      })

      app.post('/deleteFilm/:id', async (req,res)=>{
      
        let result = await filmsCollection.findOneAndDelete( 
          {
            "_id": ObjectId(req.params.id)
          }
        )
        .then(result => {
          console.log(result); 
          res.redirect('/');
        })
        .catch(error => console.error(error))
      })

      app.post('/updateFilm/:id', async (req,res) => {
        let result = await filmsCollection.findOneAndUpdate(
          {
            "_id": ObjectId(req.params.id)
          },
 
          
        )
        .then(result => {
          console.log(result); 
          res.redirect('/');
        })
        .catch(error => console.error(error))
      })

      
  })
.catch(error => console.error(error))


app.listen(process.env.PORT || 3000, 
  () => console.log("server running"));