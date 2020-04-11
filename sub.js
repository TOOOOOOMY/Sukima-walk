const ss = SpreadsheetApp.openById('Your spreadsheet ID');
const sheet = ss.getSheetByName('user_list');
const lastcolumn = sheet.getLastColumn();
const User_List = sheet.getRange(1, 1, 1, lastcolumn).getValues()[0];
const start_lon = 35.1709;
const start_lat = 136.8815;
//lon = longitude/緯度
//lat = latitude/経度

//yolpのAPPID
const appId = "Your YOLP ID";



function landmark_name(new_lon, new_lat) {
  //yahoo APIは「緯度」「経度」の順で入力
  const url = "https://map.yahooapis.jp/placeinfo/V1/get?lon=" + new_lat + "&lat=" + new_lon + "&appid="  +  appId + "&output=json";
  const response = UrlFetchApp.fetch(url); 
  const json_data=JSON.parse(response.getContentText());
  
  //ランドマークの名称をピックアップする
  const name = json_data["ResultSet"]["Result"][0]["Name"];

  return name;
}


function lon_calculater(input_time, start_lon) {
  const time = 10 + input_time //xは入力された時間
  const distance = (80 * time)/2 //経由地点までの距離
  const move = distance / (2^(1/2))
  const new_lon = start_lon - (move * 0.00000000896129323)
  return new_lon
}


function lat_calculater(input_time, start_lat) {
  const time = 10 + input_time //xは入力された時間
  const distance = (80 * time)/2 //経由地点までの距離
  const move = distance / (2^(1/2))
  const new_lat = start_lat - (move * 0.000011112 * 0.2)
  return new_lat
}


function destination_finder(User_ID, input_desti){
  const url = "https://map.yahooapis.jp/geocode/cont/V1/contentsGeoCoder?appid=" + appId + "&category=landmark&query=" + input_desti + "&category=address&output=json";
  const target_col = lastcolumn + 1;
  try{
    const response = UrlFetchApp.fetch(url); 
    const json_data=JSON.parse(response.getContentText());
    const data_description=json_data["Feature"][0]["Description"];
    const geo_data = json_data["Feature"][0]["Geometry"]["Coordinates"].split(','); 
    const lon_data = geo_data[1];
    const lat_data = geo_data[0];
    over_write(User_ID, data_description, lon_data, lat_data);
    var reply = "目的地を「" + data_description + "」に設定しました！\n\n次は余った分数を半角数字で入力してください！";
  }catch(e){
    var reply = "すみません、\nその目的地を見つけられませんでした...\n\n別の単語で検索してみてください。";
  }
  return reply;
}


function over_write(User_ID, data_description, lon_data, lat_data){
  const ID_Number = User_List.indexOf(User_ID);
  const target_col = lastcolumn + 1;
  if (ID_Number < 0){  //IDが見つからない場合
    sheet.getRange(1, target_col).setValue(User_ID);
    sheet.getRange(2, target_col).setValue(data_description);
    sheet.getRange(3, target_col).setValue(lon_data);
    sheet.getRange(4, target_col).setValue(lat_data);
  } else {
    sheet.getRange(2, ID_Number+1).setValue(data_description);
    sheet.getRange(3, ID_Number+1).setValue(lon_data);
    sheet.getRange(4, ID_Number+1).setValue(lat_data);
    sheet.getRange(5, ID_Number+1).setValue("上書きしました！");
  }
}


function data_setting(User_ID){
  const ID_Number = User_List.indexOf(User_ID);
  const target_col = lastcolumn + 1;
  if (ID_Number < 0){  //IDが見つからない場合
    var status = 0;
    var lon = '35';
    var lat = '137';
  } else {
    var status = 1;
    var lon = sheet.getRange(3, ID_Number+1).getValue();
    var lat = sheet.getRange(4, ID_Number+1).getValue();
  }
  const result = status + ',' + lon + ',' + lat;
  return result;
}


/*経路図を返す
———————————–*/
function reply_map(input_time, landm_lon, landm_lat, goal_lon, goal_lat){
  const spare_time = Number(input_time);
  
  //yahoo APIは「緯度」「経度」の順で入力
  const url = "https://map.yahooapis.jp/course/V1/routeMap?appid=" + appId + "&route=" + String(start_lon) + ","  + String(start_lat) +  ","  + landm_lon + "," + landm_lat + ","  + goal_lon + "," + goal_lat + "&pin=" + landm_lon + "," + landm_lat + "|type:default|color:blue|dx:0|dy:0&width=600&height=1000"//"&pin=" + landm_lon + "," + landm_lat + "|type:default|color:blue|dx:0|dy:0&width=600&height=1000"
  
  return url;
}

