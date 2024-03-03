# Discord.js-ServerManagement-OpenSource
## 紹介
MC連携,レポート機能,お問い合わせ機能などなどが兼ね備えられているDiscord.jsを使用したプログラムとなっています。
こちらを使ったらMC鯖の管理,Discord鯖の管理などが出来るようになります。
設定に関してはDiscordの方しか記入していませんがMC鯖のRCONの設定、メンテナンスプラグインの導入が必要です。
メンテナンスプラグインはこちらを使用します
https://www.spigotmc.org/resources/maintenance-bungee-and-spigot-support.40699/
## 設定方法
1.以下のコマンドを実行します。
```
npm init
npm i discord.js dotenv sequelize qs fs pg rcon rcon-client minecraft-server-util qs request @discordjs/builders @discordjs/rest
```
でセットアップをします
2.package.jsonのmainがapp.jsになっていることを確認してください
3.**「.env」** ファイルを作成
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
このように記入してください。
4.**「config.json」** の中を書く。
5.**「pm2 start app.js」** でBotを起動する。
※pm2をインストールしてない場合は
```
npm i pm2
```
多分これで使える。
## コマンド一覧
DiscordのBotを起動してみるのが一番早いけど
ざっとここに書いておきます。
/check : MC鯖のIPを入力して鯖が開いてるかなどをみる
/dentaku : ネタ機能です。電卓を召喚して使うことが出来ます
/embed : お知らせを作成できます
/poll : 投票作成できます
/endpoll : 投票を終了できます
/maintenance : メンテナンスのON,OFF出来る(以下のURLのプラグインを使用します)
https://www.spigotmc.org/resources/maintenance-bungee-and-spigot-support.40699/
/mcrole : MCのホワイトリスト申請&MCRole申請をします
/roleembed : ボタン等を押すとロールを貰える(💩コードすぎて動きません)
/senddm : DM送ることが出来ます
/takerole : ロールを剥奪できます
/userinfo : MC連携してたらUUIDとか出てくる

コマンドではないけどBotのDM送ったら問い合わせとして送信できる
あと、メッセージを右クリックして**アプリ/メッセージを報告** でメッセージを報告することが出来る

## 各種SNS
[X](https://x.com/dog_obaka)
[X Sub Account](https://x.com/Dog_Program09)

## 提供

このプロジェクトでは、JetBrainsの製品を使用しています。JetBrainsは、オープンソースコミュニティに対する貢献を重視しており、私たちのプロジェクトに無料でアクセスできるよう支援しています。JetBrainsの素晴らしいツールを使用できることに感謝しています。プロジェクトのサポートやJetBrainsへの寄付は、今後のプロジェクトの成長と発展に役立ちます。JetBrainsへのサポートに興味がある方は、[JetBrainsのウェブサイト](https://www.jetbrains.com/ja-jp/)をご覧ください。

![JetBrains](https://www.jetbrains.com/company/brand/img/jetbrains_logo.png)
