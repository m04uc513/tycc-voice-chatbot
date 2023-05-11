const fs = require('fs');
const fetch = require('node-fetch');

function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
}

async function fetchWAVdata(text, id, name) {
  //console.log(`#fetchWAVdata: text: ${text}`);
  //console.log(`#fetchWAVdata: id: ${id}`);
  //console.log(`#fetchWAVdata: name: ${name}`);
  const response = await fetch("http://153.126.153.39:3000/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(name, buffer);
}

async function updateWAV(cfile) {
  var ncache = [];
  var raw = fs.readFileSync(cfile);
  var cache = JSON.parse(raw);

  for (var i = 0; i < cache.length; i++) {
    var elm = cache[i];
    //console.log(old);
    if (!elm.hasOwnProperty('txt')) continue;
    if (!elm.hasOwnProperty('id')) elm.id = 4;
    //if (!elm.hasOwnProperty('wav')) {
      const date = new Date();
      elm.wav = "cache/"+formatDate(date, 'yyyyMMddHHmmssSSS')+".wav";        
    //}
    console.log(i+": "+elm.txt+" "+elm.id);
    if (!fs.existsSync(elm.wav)) {
      await fetchWAVdata(elm.txt, elm.id, elm.wav);
      console.log(i+": "+elm.wav);
    }
    ncache.push(elm);
  }

  try {
    fs.unlinkSync(cfile+"~");
    fs.renameSync(cfile, cfile+"~");
  } catch (err) {}
  var json = JSON.stringify(ncache, null, 2);
  fs.writeFileSync(cfile, json);
}

async function main() {
  const cfile = 'config/cache.json';
  await updateWAV(cfile);
}

main();
