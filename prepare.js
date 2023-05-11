const fs = require('fs');
const fetch = require('node-fetch');
const xlsx = require('xlsx');

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
  console.log(`#fetchWAVdata: name: ${name}`);
  const response = await fetch("http://153.126.153.39:3000/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(name, buffer);
}

async function downloadXlsx(url, xfile) {
  const res = await fetch(url);
  const buffer = await res.buffer();
  fs.writeFileSync(xfile, buffer);

  //console.log('# downloadXlsx: Download complete!');
}

async function makeRules(xfile, rfile) {
  const map = new Map();
  const workbook = xlsx.readFile(xfile);
  const sheetNames = workbook.SheetNames;
  //console.log(sheetNames);
  const worksheet = workbook.Sheets[sheetNames];
  for (var row = 2; ; row++) {
    var cel = worksheet[xlsx.utils.encode_cell({c: 0, r: row})];
    if (cel === undefined) break;

    var rec = [];
    rec.push(worksheet[xlsx.utils.encode_cell({c: 1, r: row})].v);
    rec.push(worksheet[xlsx.utils.encode_cell({c: 2, r: row})].v);
    cel = worksheet[xlsx.utils.encode_cell({c: 3, r: row})];
    if (cel != undefined) {
      rec.push(cel.v);
      rec.push(worksheet[xlsx.utils.encode_cell({c: 4, r: row})].v);
    }
    //console.log(rec);
    var key = rec.shift();
    var val = map.get(key);
    if (val == undefined) val = [];
    val.push(rec);
    map.set(key, val);
}

  const array = Array.from(map);
  const json = JSON.stringify(array, null, 2);
  //console.log(json);
  fs.writeFileSync(rfile, json);

  //console.log('# makeRules: complete!');
}


async function makeQuestion(xfile, qfile) {
  var Q = [];
  const workbook = xlsx.readFile(xfile);
  const sheetNames = workbook.SheetNames;
  //console.log(sheetNames);
  const worksheet = workbook.Sheets[sheetNames];
  for (var row = 2; ; row++) {
    var cel = worksheet[xlsx.utils.encode_cell({c: 0, r: row})];
    if (cel === undefined) break;
    var e = [];
    e.push(worksheet[xlsx.utils.encode_cell({c: 1, r: row})].v);
    cel = worksheet[xlsx.utils.encode_cell({c: 3, r: row})];
    if (cel != undefined) e.push(cel.v);
    Q.push(e);
  }

  var json = JSON.stringify(Q, null, 2);
  fs.writeFileSync(qfile, json);

  //console.log('# makeQuestion: complete!');
}


async function makeAnswer(xfile, afile) {
  var A = [];
  const workbook = xlsx.readFile(xfile);
  const sheetNames = workbook.SheetNames;
  //console.log(sheetNames);
  const worksheet = workbook.Sheets[sheetNames];
  for (var row = 2; ; row++) {
    var cel = worksheet[xlsx.utils.encode_cell({c: 0, r: row})];
    if (cel === undefined) break;

    A.push(worksheet[xlsx.utils.encode_cell({c: 2, r: row})].v);
    cel = worksheet[xlsx.utils.encode_cell({c: 4, r: row})];
    if (cel != undefined) {
      A.push(cel.v);
    }
  }

  var json = JSON.stringify(A, null, 2);
  fs.writeFileSync(afile, json);

  //console.log('# makeAnswer: complete!');
}

async function prefetchWAV(afile, cfile) {
  var index = [];
  var raw = fs.readFileSync(afile);
  var answer = JSON.parse(raw);

  for (var i = 0; i < answer.length; i++) {
    var elm = {};
    elm.txt = answer[i];
    elm.id  = 4;
    const date = new Date();
    elm.wav = "./cache/"+formatDate(date, 'yyyyMMddHHmmssSSS')+".wav";
    await fetchWAVdata(elm.txt, elm.id, elm.wav);
    console.log(i+": "+elm.txt+" "+elm.id+" "+elm.wav);
    index.push(elm);
  }

  var json = JSON.stringify(index, null, 2);
  fs.writeFileSync(cfile, json);
}

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9Jxjsp_H1v-N37xHu6LOZ2vOpedtgSe6VGht_-kL_-PWBEJ3c36ofAm8PMT0KOA/pub?output=xlsx';
  const xfile = 'config/data.xlsx';
  const rfile = 'config/rules.json';
  const qfile = 'config/question.json';
  const afile = 'config/answer.json';
  const cfile = 'config/cache.json';

  await downloadXlsx(url, xfile);
  await makeRules(xfile, rfile);
  await makeQuestion(xfile, qfile);
  await makeAnswer(xfile, afile);
  await prefetchWAV(afile, cfile);

  fs.unlinkSync(xfile);
}

//prefetchWAV('config/answer.json', 'config/cache.json');
main();
