/*
なんかあったら下を１に変更⇒
応答をすべて「メンテ中です」にできる
*/
const maintenace =0; //メンテナンス・緊急対応実行時は1に変更

const LINE_TOKEN = "Your LINE TOKEN";

/*
LINEから送信されたデータをメイン処理する
———————————–*/
function doPost(e) {
  /* レスポンスを取得 */
  const responseLine = e.postData.getDataAsString();
  /* JSON形式に変換する */
  const responseLineJson = JSON.parse(responseLine).events[0];
  /* イベントへの応答に使用するトークンを取得 */
  const replyToken = responseLineJson.replyToken;

  var json = JSON.parse(e.postData.contents);
  //user_idの取得、var宣言をしなければグローバル化
  LINE_user_id = json.events[0].source.userId;

  /*– メッセージイベントの場合 ———————–*/
  if (responseLineJson.type == 'message') {
    messageController(responseLineJson, replyToken);
  }
}


/*
メッセージイベントの処理
———————————–*/
function messageController(events, replyToken) {
  
  var start_lon = 35.1727;
  var start_lat = 136.8925;

  const message = events.message;
  const input = message.text;
  var text = input.replace(/\r?\n/g, '');
  if (maintenace == 0){
    if (text.match(/^[0-9]+$/)){
      var landm_lon = lon_calculater(text, start_lon);
      var landm_lat = lat_calculater(text, start_lat);
      var landm_name = landmark_name(landm_lon, landm_lat);
      var data_status = data_setting(LINE_user_id).split(',');
      if (data_status[0] == 0){
        var content = "まず目的地を入力してください！";
      } else {
      var goal_lon = data_status[1];
      var goal_lat = data_status[2];
      var content = '寄り道先は\n「' + landm_name + '」です！\nこの運動で、\nケーキ１個分のエネルギーを消費できそうですよ！\n\n道順はコチラ↓\n' + reply_map(text, landm_lon, landm_lat, goal_lon, goal_lat);
      }
    } else if (text.match(/^[ぁ-んァ-ン一-龥]/)){
      var content = destination_finder(LINE_user_id, text);
    } else {
      var content = "目的地を入力した後、余った時間を分単位で入力してね";
    }
  } else {
  //メンテナンス実行時
    var content = "大変申し訳ありません。\nただ今メンテナンス中です。\n\n完了までしばらくお待ちください。"
  }

  var LineMessageObject = [{
      'type': 'text',
      'text': content
  }];

  replyLine(LineMessageObject, replyToken);
}

/*
LINEに返信する処理
———————————–*/
function replyLine(LineMessageObject, replyToken) {
    const replyHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LINE_TOKEN
    };

    const replyBody = {
        'replyToken': replyToken,
        'messages': LineMessageObject
    };

    const replyOptions = {
        'method': 'POST',
        'headers': replyHeaders,
        'payload': JSON.stringify(replyBody)
    };

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', replyOptions);
}
