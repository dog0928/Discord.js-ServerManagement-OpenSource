# Discord.js-ServerManagement-OpenSource
## 紹介
MC連携,レポート機能,お問い合わせ機能などなどが兼ね備えられているDiscord.jsを使用したプログラムとなっています。<br>
こちらを使ったらMC鯖の管理,Discord鯖の管理などが出来るようになります。<br>
設定に関してはDiscordの方しか記入していませんがMC鯖のRCONの設定、メンテナンスプラグインの導入が必要です。<br>
メンテナンスプラグインはこちらを使用します<br>
https://www.spigotmc.org/resources/maintenance-bungee-and-spigot-support.40699/<br>
こちらのサイトでも使い方などが書いてあります<br>
https://pocketen.com/opensource/ServerManagementOpenSource.html
## 設定方法
Git
```
git clone https://github.com/dog0928/Discord.js-ServerManagement-OpenSource.git
```
1.以下のコマンドを実行します。<br>
```
npm i discord.js dotenv sequelize qs fs pg rcon rcon-client minecraft-server-util qs request @discordjs/builders @discordjs/rest
```
でセットアップをします<br>
2.package.jsonのmainがapp.jsになっていることを確認してください<br>
3.**「.env」** ファイルを作成<br>
```
##Discord
clientId=Bot Client Id
guildId=ServerId
token=Bot Token

##MCサーバー
MC_IP=RCON IP
MC_PORT=RCON PORT
MC_PASS=RCON PASS

##データベース
DB_IP=DB IP
DB_PASS=DB PASS
```
このように記入してください。<br>
4.**「config.json」** の中を書く。<br>
5.**「pm2 start app.js」** でBotを起動する。<br>
※pm2をインストールしてない場合は<br>
```
npm i pm2
```
多分これで使える。<br>
## コマンド一覧
DiscordのBotを起動してみるのが一番早いけど<br>
ざっとここに書いておきます。<br>
/check : MC鯖のIPを入力して鯖が開いてるかなどをみる<br>
/dentaku : ネタ機能です。電卓を召喚して使うことが出来ます<br>
/embed : お知らせを作成できます<br>
/poll : 投票作成できます<br>
/endpoll : 投票を終了できます<br>
/maintenance : メンテナンスのON,OFF出来る(以下のURLのプラグインを使用します)<br>
https://www.spigotmc.org/resources/maintenance-bungee-and-spigot-support.40699/<br>
/mcrole : MCのホワイトリスト申請&MCRole申請をします<br>
/roleembed : ボタン等を押すとロールを貰える(💩コードすぎて動きません)<br>
/senddm : DM送ることが出来ます<br>
/takerole : ロールを剥奪できます<br>
/userinfo : MC連携してたらUUIDとか出てくる<br><br>

コマンドではないけどBotのDM送ったら問い合わせとして送信できる<br>
あと、メッセージを右クリックして**アプリ/メッセージを報告** でメッセージを報告することが出来る<br>

## 各種SNS
[YouTube](https://www.youtube.com/@obaka_Dog)<br>
[X](https://x.com/dog_obaka)<br>
[X Sub Account](https://x.com/Dog_Program09)
