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
    var n = Math.floor(question.length*Math.random());
    var ask = question[n][0];
    console.log(ask);

    var result = await botui.action.text({
      delay: 1000,
      action: {
        size: 40,
        placeholder: ask  //'入力してください'
      }
    });

    var q = result.value;
    while (q.startsWith(' ')) {
      q = q.slice(1);
    }
    console.log(q);

    bucket = getAnswer(map, q);
    console.log(bucket[0]);
    botui.message.bot(bucket[0]);
    await playAudio(bucket[0]);
  }
}

main();
