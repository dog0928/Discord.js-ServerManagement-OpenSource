"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    ButtonBuilder = _require.ButtonBuilder,
    ActionRowBuilder = _require.ActionRowBuilder,
    EmbedBuilder = _require.EmbedBuilder; // グローバル変数として、現在の投票のメッセージIDを保持する変数を定義


var currentPollId = null;
module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('投票を開始します').addStringOption(function (option) {
    return option.setName('title').setDescription('投票のタイトル').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('a').setDescription('候補1を入力してください').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('b').setDescription('候補2を入力してください').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('c').setDescription('候補3を入力してください').setRequired(false);
  }).addStringOption(function (option) {
    return option.setName('d').setDescription('候補4を入力してください').setRequired(false);
  }),
  execute: function execute(interaction) {
    var client, emojis, title, a, b, c, d, choices, copytocommand, embed, poll, buttonRow, collector;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // interactionオブジェクトからclientを取得
            client = interaction.client;
            emojis = ['🇦', '🇧', '🇨', '🇩'];
            title = interaction.options.getString('title');
            a = interaction.options.getString('a');
            b = interaction.options.getString('b');
            c = interaction.options.getString('c');
            d = interaction.options.getString('d');
            choices = [a, b, c, d].filter(Boolean); // 空でない候補のみ抽出

            copytocommand = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('copypollcommand').setLabel('Copy Command').setStyle(2));
            embed = new EmbedBuilder().setTitle(title).setDescription(choices.map(function (c, i) {
              return "".concat(emojis[i], " ").concat(c);
            }).join('\n'));
            _context2.next = 12;
            return regeneratorRuntime.awrap(interaction.channel.send({
              embeds: [embed],
              components: [copytocommand]
            }));

          case 12:
            poll = _context2.sent;
            emojis.slice(0, choices.length).forEach(function (emoji) {
              return poll.react(emoji);
            });
            buttonRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('poll_command_button').setLabel('集計').setStyle(2), new ButtonBuilder().setCustomId('poll_delete_button').setLabel('削除').setStyle(4)); // 新しい投票が始まったので、現在の投票IDをリセットする

            currentPollId = poll.id;
            _context2.next = 18;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u96C6\u8A08\u6642\u306F " + '```' + "/endpoll channel_id:".concat(poll.channel.id, " message_id:").concat(poll.id) + '```' + "\u3068\u9001\u4FE1\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n\u305D\u308C\u304B\u4EE5\u4E0B\u306E\u30DC\u30BF\u30F3\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044",
              components: [buttonRow],
              ephemeral: true
            }));

          case 18:
            _context2.next = 20;
            return regeneratorRuntime.awrap(poll.edit({
              embeds: [embed]
            }));

          case 20:
            collector = interaction.channel.createMessageComponentCollector();
            collector.on('collect', function _callee(i) {
              var channelId, messageId, channel, message, _embed, reactions, result, resultMessage, resultReply, commandInfo, commandMessage;

              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(i.customId === 'poll_command_button')) {
                        _context.next = 31;
                        break;
                      }

                      if (!(currentPollId !== poll.id)) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt("return", i.editReply("このボタンは現在の投票に対してのみ有効です。"));

                    case 3:
                      channelId = interaction.channel.id;
                      messageId = currentPollId;
                      channel = interaction.guild.channels.cache.get(channelId);

                      if (channel) {
                        _context.next = 8;
                        break;
                      }

                      return _context.abrupt("return", i.editReply("チャンネルIDの指定が間違っているか、チャンネルが見つかりません。"));

                    case 8:
                      _context.next = 10;
                      return regeneratorRuntime.awrap(channel.messages.fetch(messageId)["catch"](function (err) {
                        console.error(err);
                        return null;
                      }));

                    case 10:
                      message = _context.sent;

                      if (message) {
                        _context.next = 13;
                        break;
                      }

                      return _context.abrupt("return", i.editReply("メッセージIDの指定が間違っているか、メッセージが見つかりません。"));

                    case 13:
                      if (!(message.author.id !== interaction.client.user.id)) {
                        _context.next = 15;
                        break;
                      }

                      return _context.abrupt("return");

                    case 15:
                      _embed = message.embeds[0];

                      if (!(!_embed || !_embed.title || !_embed.description)) {
                        _context.next = 18;
                        break;
                      }

                      return _context.abrupt("return", interaction.reply("その投票は無効です。"));

                    case 18:
                      // リアクションを取得
                      reactions = message.reactions.cache; // 投票結果の作成

                      result = _embed.description.split('\n').map(function (field) {
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

                      _context.next = 23;
                      return regeneratorRuntime.awrap(interaction.channel.send("## **".concat(_embed.title, "** \u306E\u6295\u7968\u7D50\u679C\uFF1A\n").concat(resultMessage)));

                    case 23:
                      resultReply = _context.sent;
                      // 投票メッセージを編集して終了を示す
                      message.edit({
                        content: "\u3053\u306E\u6295\u7968\u306F\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n[**\u7D50\u679C\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u30EA\u30F3\u30AF**](https://discord.com/channels/".concat(interaction.guild.id, "/").concat(channelId, "/").concat(resultReply.id, ")"),
                        embeds: []
                      }); // 元の投票メッセージのリアクションをすべて削除

                      message.reactions.removeAll()["catch"](function (error) {
                        return console.error('リアクションを削除できませんでした:', error);
                      });
                      _context.next = 28;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 28:
                      i.editReply({
                        content: "投票が終了し、結果が送信されました。",
                        components: [],
                        ephemeral: true
                      });
                      _context.next = 46;
                      break;

                    case 31:
                      if (!(i.customId === "copypollcommand")) {
                        _context.next = 40;
                        break;
                      }

                      _context.next = 34;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 34:
                      commandInfo = i.client.commands.get('poll').data.toJSON(); // コマンドの名前

                      commandMessage = "/".concat(commandInfo.name); // コマンドのオプション

                      commandInfo.options.forEach(function (option) {
                        if (option.required) {
                          commandMessage += " ".concat(option.name, ":").concat(interaction.options.getString(option.name));
                        } else {
                          var value = interaction.options.getString(option.name);

                          if (value) {
                            commandMessage += " ".concat(option.name, ":").concat(value);
                          }
                        }
                      });
                      i.followUp({
                        content: "<@!".concat(interaction.user.id, ">\u304C\u3053\u306E\u6295\u7968\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F\n\u30B3\u30DE\u30F3\u30C9\u3092\u30B3\u30D4\u30FC") + '```' + commandMessage + '```',
                        ephemeral: true
                      });
                      _context.next = 46;
                      break;

                    case 40:
                      if (!(i.customId === "poll_delete_button")) {
                        _context.next = 46;
                        break;
                      }

                      _context.next = 43;
                      return regeneratorRuntime.awrap(poll["delete"]());

                    case 43:
                      _context.next = 45;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 45:
                      i.editReply({
                        content: "投票を削除しました。",
                        ephemeral: true,
                        components: []
                      });

                    case 46:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            return _context2.abrupt("return");

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};