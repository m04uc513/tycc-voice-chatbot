/*
 * 2023/06/06 NOTE:
 * ffmpeg コマンドの引数は以下のとおり。
 * 
 * ffmpeg -i ${input} 
 * -vn -ac 2 -ar 44100 -ab 128k -acodec libfdk_aac -f mp4 ${output}
 * 
 * 次の Qiita 記事の「WAVからAAC形式へ変換」を参考にした。（ちょっと古い？）
 * 
 *  【ffmpeg】音声形式の変換方法まとめ
 *   https://qiita.com/suzutsuki0220/items/43c87488b4684d3d15f6
 *
 * 各オプションの意味はソースコードにコメントで記述してる。
 * ただし音声コーデックは次のブログ記事の手順でインストールした。
 * 
 * 　【mac で ffmpeg で libfdk_aac を使う】
 *   https://scrapbox.io/craftmemo/mac_%E3%81%A7_ffmpeg_%E3%81%A7_libfdk_aac_%E3%82%92%E4%BD%BF%E3%81%86)
 *
 * 後でちゃんと調べる
 */

const { execSync } = require('child_process');

async function execffmpeg(input, output) {
  const ffmpeg =  'ffmpeg'+
                  ' -i '+input+           // 入力ファイル
                  ' -vn'+                 // ビデオ無効
                  ' -ac 2'+               // 音声チャンネル数
                  ' -ar 44100'+           // 音声周波数
                  ' -ab 128k'+            // 音声ビットレート
                  ' -acodec libfdk_aac'+  // 音声コーデック
                  ' -f mp4 '+             // フォーマット
                  output;
  try {
    execSync(ffmpeg, { stdio: 'ignore' });
    //console.log(`コマンドの実行が完了しました: ${output}`);
  } catch (error) {
    console.error(`エラーが発生しました: ${error.message}`);
    //throw error; // エラーをスローして呼び出し元でキャッチする
    process.exit(1);
  }
}

const fs = require('fs');

async function main() {
  const cachefiles = 'config/cache.json';
  const aacfiles = 'config/aac.json';

  var aacs = [];
  var caches = JSON.parse(fs.readFileSync(cachefiles));
  for (var i = 0; i < caches.length; i++) {
    var olde = caches[i]
    if (!olde.hasOwnProperty('txt')) continue;
    if (!olde.hasOwnProperty('id'))  continue;
    if (!olde.hasOwnProperty('wav')) continue;
    var s = olde.wav;
    s = s.replace(/cache/g, 'aac');
    s = s.replace(/.wav/g, '.aac');
    var newe = {};
    newe.txt = olde.txt;
    newe.id  = olde.id;
    newe.wav = olde.wav;
    newe.aac = s;
    //console.log(newe);
    aacs.push(newe);
  }

  try {
    fs.unlinkSync(aacfiles+"~");
    fs.renameSync(aacfiles, aacfiles+"~");
  } catch (err) {}
  var json = JSON.stringify(aacs, null, 2);
  fs.writeFileSync(aacfiles, json);

  var reaacs = JSON.parse(fs.readFileSync(aacfiles));
  for (var i = 0; i < reaacs.length; i++) {
    var elm = reaacs[i];
    console.log(elm.wav+' ---> '+elm.aac);
    execffmpeg(elm.wav, elm.aac);
  }
}

main();

/*
async function executeCommands() {
  try {
    for (let i = 0; i < 500; i++) {
      const inputFilePath = `input${i}.wav`;
      const outputFilePath = `output${i}.aac`;
      await runFFmpegCommand(inputFilePath, outputFilePath);
    }
  } catch (error) {
    console.error(`エラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}

executeCommands();
*/