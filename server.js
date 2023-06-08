// server.js
// where your node app starts

// init project
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");

//var raw = fs.readFileSync('config/cache.json');
var raw = fs.readFileSync('config/aac.json');
var cache = JSON.parse(raw);
const map = new Map();

for (var i = 0; i < cache.length; i++) {
  var elm = cache[i];
  map.set(elm.txt, elm);
}

//console.log(map.get('読み取れませんでした。もう一度入力してください'));
//process.exit(0);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.post("/texttospeach", async (req, res) => {
  //console.log(req.body);
  const text = req.body.text;
  const id = parseInt(req.body.id);
  var elm = map.get(text);
  //const wavBuffer = fs.readFileSync(elm.wav);
  const wavBuffer = fs.readFileSync(elm.aac);
  res.set({
  //"Content-Type": "audio/wav",
    "Content-Type": "audio/aac",
    "Content-Disposition": 'attachment; filename="audio.aac"',
  });
  await res.send(wavBuffer);
});

app.get('/rules', async (req, res) => {
  const data = fs.readFileSync('config/rules.json', 'utf8');
  res.send(JSON.parse(data));
});

app.get('/question', async (req, res) => {
  const data = fs.readFileSync('config/question.json', 'utf8');
  res.send(JSON.parse(data));
});

// listen for requests :)
const listener = app.listen(port, function() {
  //console.log("Your app is listening on port " + listener.address().port);
  console.log(`Server listening on port ${port}`);
});
