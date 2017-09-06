const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let url = 'mongodb://localhost:27017/vendingmachine';
mongoose.connect(url);
const Stats = require('./models/stats.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
app.use(bodyParser.json())



app.get('/api/activities',function(req, res) {
  Stats.find()
  .then(function(results) {
    res.json({status: 'success', 'data': results
  })
})
})

app.post('/api/activities', function(req, res) {
  const newStat = new Stats({
    activity: req.body.activity,
    times: req.body.times,
    date: req.body.date
  })
  newStat.save()
   .then(function(results) {
     console.log("saved " + results);
     res.json({status: 'success'})
   })
})
app.get('/api/activities/:id',function(req, res) {
  let id = req.params.id;
  Stats.findOne({
    id: new ObjectId(id)
  })
  .then(function(results) {
    res.json({status: 'success', 'data': results
  })
})
})
app.put('/api/activities/:id', function(req, res) {
  let id = req.params.id
  Stats.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set:{
      activity: req.body.activity,
      times: req.body.times,
      date: req.body.date
    }
    })

    .then(function(results) {
      res.json({status: 'success'
    })
})
})
app.delete('/api/activities/:id', function(req, res) {
  let id = req.params.id;
  Stats.deleteOne({
      _id: new ObjectId(id)
    })
    .then(function(results) {
      res.json({status: 'success'
    })
})
})
app.post('/api/activities/:date/stats', function(req, res) {
  let date = req.params.date;
  Stats.update({
      date: date
    }, {
      $set:{
      activity: req.body.activity,
      times: req.body.times,
      date: req.body.date
    }
  }, {upsert: true})

    .then(function(results) {
      res.json({status: 'success'
    })
})
})
app.delete('/api/stats/:date', function(req, res) {
  let date = req.params.date;
  Stats.remove({
      date: date
    })
    .then(function(results) {
      res.json({status: 'success'
    })
})
})

const users = {
    'sarah': 'shuey'
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

// put routes here

app.get('/api/login',
    passport.authenticate('basic', {session: false}),
    function (req, res) {
        res.json({"hello": req.user})
    }
);

app.listen(3000, function() {
  console.log('Successfully started express appslication!');
});
