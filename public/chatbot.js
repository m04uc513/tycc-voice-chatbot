var botui = new BotUI('chatbot');

async function playAudio(text) {
  const id = 4;
  const response = await fetch("/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  //const blob = await response.blob();
  //const audioUrl = URL.createObjectURL(blob);
  //const audio = new Audio(audioUrl);
  //audio.play();
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

async function fetchRules() {
  const response = await fetch('/rules');
  const array = await response.json();
  console.log('# fetchRules: done\n');
  return(new Map(array));
}


async function fetchQuestion() {
  const response = await fetch('/question');
  console.log('# fetchQuestion: done\n');
  var question = await response.json();
  return(question);
}

function getAnswer(map, q) {
  var rbucket = map.get(q);
  if (rbucket == undefined) {
    return(['読み取れませんでした。もう一度入力してください']);
  }
  var choice = rbucket[0];
  if (rbucket.length > 1) {
    var n = Math.floor(rbucket.length*Math.random());
    choice = rbucket[n];
  }
  return(choice);
}

async function main() {
  var map = await fetchRules();
  var question = await fetchQuestion();
  var bucket = [];
  while (true) {
    var ask;
    if (bucket.length == 0) {
      var n = Math.floor(question.length*Math.random());
      ask = question[n][0];
    } else {
      ask = bucket[0];
    }
    var result = await botui.action.text({
      delay: 1000,
      action: {
        size: 40,
        placeholder: ask  //'入力してください'
      }
    });
    var q = result.value;
    console.log(q);
    
    //// hex dump
    //const encoder = new TextEncoder();
    //const buf = encoder.encode(q);
    //const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
    //console.log(hex); // 48656c6c6f20576f726c64
    while (q.startsWith(' ')) {
      q = q.slice(1);
    }

    if (bucket.length > 0) {
      var sq = bucket.shift();
      console.log(sq);
      var sa = bucket.shift();
      console.log(sa);
      if (q == sq) {
        console.log(sa);
        botui.message.bot(sa);
        await playAudio(sa);
      }
    } else {
      bucket = getAnswer(map, q);
      var a = bucket.shift();
      console.log(a);
      botui.message.bot(a);
      await playAudio(a);
    }
  }
}

main();
