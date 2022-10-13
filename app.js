const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
const { ObjectId } = require('mongodb');

dotenv.config({path:'config.env'});

app.use(bodyParser.urlencoded({ extended: true }))


MongoClient.connect(process.env.MONGO_URI, { 
    useUnifiedTopology: true}) 
    .then(client =>{
      console.log('connected to db')
      const db = client.db('roster')
      const playersCollection = db.collection('players')  
      
      app.set('view engine', 'ejs')
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json());
      app.use(express.static('public'));
      

      app.get('/', (req, res) => {
        db.collection('players').find().toArray()
          .then(results => {
            res.render('index.ejs', { players: results})
          })
          .catch(error => console.error(error))
        // res.render('index.ejs', {})  
      })

      app.post('/players', (req, res) => {
        playersCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

      app.post('/players', (req,res) => {
          console.log(req.body);
      })

      app.post('/deletePlayer/:id', async (req,res)=>{
      
        let result = await playersCollection.findOneAndDelete( 
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

      app.post('/updatePlayer/:id', async (req,res) => {
        let result = await playersCollection.findOneAndUpdate(
          {
            "_id": ObjectId(req.params.id)
          },
          {
            $set: {
              name: 'Peyton Manning',
              position: 'QB',
              number: 18
            }
          }
        )
        .then(result => {
          console.log(result); 
          res.redirect('/');
        })
        .catch(error => console.error(error))
      })

      app.listen(process.env.PORT || 3000, 
        () => console.log("server running"));
  })
.catch(error => console.error(error))