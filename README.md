# スキマウォーク
[Giospatial Hackers Program 2019 東海](https://ghp.connpass.com/) にて、「余った時間を健康的に」をテーマに開発したラインボットです。

## Description
「もうすぐ目的地だけど約束まであと２０分」「友達が３０分遅れる」なんて時、皆さんはどうしていますか？  
スマホで時間つぶし？カフェに入る？   
せっかくなら健康的に、ちょっと周りを歩いてみませんか？  
  
このボットに「目的地」と「余った時間」を入力すると、余った時間ちょうどの寄り道を提案してくれます。
いつもとはちょっと違う道を、楽しんでみましょう。

## Demo
![sukima_walk_demo](https://user-images.githubusercontent.com/45617592/79033235-9115ac80-7be7-11ea-875c-94dc290bd30d.gif)

## Note
・現在地は名古屋駅 JRセントラルタワーズで固定です。  
・余った時間から算出した距離をGAS上で経度・緯度に換算することが難しく、無理やり計算式を設定しましたが寄り道先がほぼ固定されてしまっています。
  
## References
・[Yahoo! Open Local Platform（YOLP）](https://developer.yahoo.co.jp/webapi/map/)
・[Google App Script](https://developers.google.com/apps-script)
・[LINE Messaging API](https://developers.line.biz/ja/services/messaging-api/)
