const express = require('express');
const { connect } = require('http2');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { type } = require('os');

const uri = "mongodb+srv://cs120:980708@cluster0.glyxwiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
    try{
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e);
    }
}
run();

router.get('/', (req, res) => { 
    res.render('home');
});

router.post('/process', async (req, res) => {
    const input = req.body.input;
    const isZipCode = /^\d/.test(input);

    try {
      const db = client.db('places_db');
      const collection = db.collection('places');
  
      let result;
      if (isZipCode) {
        result = await collection.findOne({ zips: input });
      } else {
        result = await collection.findOne({ place: input });
      }
  
      if (result) {
        res.render('result', { place: result.place, zips: result.zips });
      } else {
        res.render('result', { error: 'No matching place or zip code found.' });
      }
    } catch (err) {
      console.error("Error querying database:", err);
      res.render('result', { error: 'An error occurred while processing your request.' });
    }
});



module.exports = router;