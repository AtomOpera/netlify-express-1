'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const cors = require('cors');

app.use(cors());

function saveFile(input) {
  
  fs.writeFile("./express/test.json", input, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
  return 0;
};
//saveFile("lalala");

const router = express.Router();
router.get('/', (req, res) => {
  fs.readFile("./express/test.json", 'utf8', (err, data) => {
    if (err) throw err;
    //console.log(data);
    //res.send(JSON.parse(data));
    //dataInTxt = JSON.stringify(data);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.write(JSON.stringify(JSON.parse(data)));
    res.end();
  });
  
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.use(bodyParser.urlencoded({ extended: true }));

// Create a new entry
app.post('/new', (req, res) => {
  console.log("Creating new...");
  console.log(req.body);      // your JSON
  saveFile(JSON.stringify(req.body));
  res.send(req.body);    // echo the result back
});

app.get('/getData', (req, res) => {
  fs.readFile("./src/test.json", 'utf8', (err, data) => {
    if (err) throw err;
    //console.log(data);
    res.send(JSON.parse(data));
    //dataInTxt = JSON.stringify(data);
  });
  // res.send(dataInTxt);
});

module.exports = app;
module.exports.handler = serverless(app);
