
async function playAudio(text, id) {
  const response = await fetch("/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play();
}

async function fetchRules() {
  const response = await fetch('/rules');
  const array = await response.json();
  app.map = new Map(array);
  app.output = '# fetchRules: done\n';
}

async function fetchQuestion() {
  const response = await fetch('/question');
  app.question = await response.json();
  app.output += '# fetchQuestion: done\n';
}

async function mainloop() {
  for (var i = 0; i < app.question.length; i++) {
    // questions.json から入力データを１セット取り出す
    // 取り出せるのは要素が１個あるいは２個のデータ
    // 通常は１個だが、２個目の追加質問がある場合もある
    var ibucket = app.question[i];
    var q = ibucket.shift();
    app.output += 'Q: '+q+'\n';
    //await playAudio(q, 6);

    // rules.json から１個目の質問にマッチするルールセットを取り出す
    // １つ以上のルールセットが取り出せる（１つの質問に複数の回答が定義される場合がある）
    var rbucket = app.map.get(q);

    // ルールセットが１つしかない場合はそれを選択するが…
    var n = 0;
    var choice = rbucket[0];

    // ルールセットが複数存在する場合は乱数を使ってラウンドロビンで１つを選ぶ
    if (rbucket.length > 1) {
      n = Math.floor(rbucket.length*Math.random());
      choice = rbucket[n];
    }

    // 個々のルールセットには要素が１つあるいは３つ格納されている
    // 要素１つの場合は、シンプルに質問に対応する応答である
    var a = choice.shift();
    app.output += 'A: '+a+'\n';
    //await playAudio(a, 4);

    // もし要素がまだ２つ残ってれば、追加質問とそれに対応する応答である
    if (choice.length > 1 && ibucket.length > 0) {
      if (ibucket[0] == choice[0]) {
        q = ibucket.shift();
        app.output += 'Q+: '+q+'\n';
        //await playAudio(q, 6);
        a = choice.shift();
        a = choice.shift();
        app.output += 'A+: '+a+'\n';
        //await playAudio(a, 4);
      }
    }
  }
}

var app = new Vue({
  el: '#app',
  data: {
    output: null,
    map: null,
    question: null
  },
  async mounted() {
    await fetchRules();
    await fetchQuestion();
    await mainloop();
/*
    for (var i = 0; i < this.question.length; i++) {
      var q = this.question[i];
      //console.log(q);
      app.output += 'Q: '+q[0]+'\n';
      var a = this.map.get(q[0]);
      //console.log(a);
      app.output += 'A: '+a[0][0]+'\n';
    }
*/
  }
});
