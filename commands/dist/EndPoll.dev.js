"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('endpoll').setDescription('投票を終了し、結果を表示します').addStringOption(function (option) {
    return option.setName('channel_id').setDescription('投票メッセージが存在するチャンネルのID').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('message_id').setDescription('投票メッセージのID').setRequired(true);
  }),
  execute: function execute(interaction) {
    var channelId, messageId, channel, message, embed, reactions, result, resultMessage, resultReply;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            channelId = interaction.options.getString('channel_id');
            messageId = interaction.options.getString('message_id');
            channel = interaction.guild.channels.cache.get(channelId);

            if (channel) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", interaction.reply("チャンネルIDの指定が間違っているか、チャンネルが見つかりません。"));

          case 5:
            _context.next = 7;
            return regeneratorRuntime.awrap(channel.messages.fetch(messageId)["catch"](function (err) {
              console.error(err);
              return null;
            }));

          case 7:
            message = _context.sent;

            if (message) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", interaction.reply("メッセージIDの指定が間違っているか、メッセージが見つかりません。"));

          case 10:
            if (!(message.author.id !== interaction.client.user.id)) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return");

          case 12:
            embed = message.embeds[0];

            if (!(!embed || !embed.title || !embed.description)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", interaction.reply("その投票は無効です。"));

          case 15:
            // リアクションを取得
            reactions = message.reactions.cache; // 投票結果の作成

            result = embed.description.split('\n').map(function (field) {
              var emoji = field.split(' ')[0];
              var choice = field.split(' ')[1];
              var reaction = reactions.find(function (reaction) {
                return reaction._emoji.name === emoji;
              });
              var count = reaction ? reaction.count : 0; // 自分自身のリアクションを除外

              return {
                emoji: emoji,
                choice: choice,
                count: count
              };
            });
            resultMessage = result.map(function (n) {
              return "**".concat(n.choice, "**\n").concat(n.emoji, "\uFF1A").concat(n.count, "\u7968");
            }).join("\n"); // 投票結果を実行されたチャンネルに送信

            _context.next = 20;
            return regeneratorRuntime.awrap(interaction.channel.send("## **".concat(embed.title, "** \u306E\u6295\u7968\u7D50\u679C\uFF1A\n").concat(resultMessage)));

          case 20:
            resultReply = _context.sent;
            // 投票メッセージを編集して終了を示す
            message.edit({
              content: "\u3053\u306E\u6295\u7968\u306F\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n[**\u7D50\u679C\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u30EA\u30F3\u30AF**](https://discord.com/channels/".concat(interaction.guild.id, "/").concat(channelId, "/").concat(resultReply.id, ")"),
              embeds: []
            }); // 元の投票メッセージのリアクションをすべて削除

            message.reactions.removeAll()["catch"](function (error) {
              return console.error('リアクションを削除できませんでした:', error);
            });
            interaction.reply({
              content: "投票が終了し、結果が送信されました。",
              ephemeral: true
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};