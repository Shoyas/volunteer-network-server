const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB_USERNAME = volunteerAdmin ;
// DB_USERPASS = volunteerAdmin01@ ;
// DB_NAME = volunteerNetwork ;


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://volunteerAdmin:volunteerAdmin01@@cluster0.0wqac.mongodb.net/volunteerNetwork?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const users = client.db("volunteerNetwork").collection("volunteerRegistration");
  const events = client.db("volunteerNetwork").collection("volunteerEvents");
  const newEvents = client.db("volunteerNetwork").collection("volunteerNewEvents");


  app.post('/addUser', (req, res) => {
      const newUser = req.body;
      users.insertOne(newUser)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/userList', (req, res) => {
    users.find({useEmail: req.query.email})
    .toArray((error, documents) => {
      res.send(documents);
      
    })
  })

  app.get('/volunteerList', (req, res) => {
    console.log(req.body);
    users.find({})
    .toArray((error, documents) => {
      res.send(documents);
    })
  })

  app.post('/addEvent', (req, res) => {
    const event = req.body;
    events.insertOne(event)
    .then(result => {
      res.send(result.insertedCount)
      
    })

  })

  app.get('/volunteerItems', (req, res) => {
    events.find({}).limit(20)
    .toArray((error, documents) => {
      res.send(documents);
    })
  })

  app.post('/addNewEvent', (req, res) => {
    const newEvent = req.body;
    newEvents.insertOne(newEvent)
    .then(result => {

      res.send(result.insertedCount > 0)
      
    })

  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);