"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    ActionRowBuilder = _require.ActionRowBuilder,
    ButtonBuilder = _require.ButtonBuilder;

var _require2 = require('../config.json'),
    RoleChannel = _require2.RoleChannel,
    RoleNofication = _require2.RoleNofication,
    RoleName = _require2.RoleName;

var _require3 = require("rcon-client"),
    Rcon = _require3.Rcon;

var User = require('../user');

require('dotenv').config();

function getProfileId(username) {
  var _response, data;

  return regeneratorRuntime.async(function getProfileId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("https://api.mojang.com/users/profiles/minecraft/".concat(username)));

        case 3:
          _response = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(_response.json());

        case 6:
          data = _context.sent;

          if (!(data && data.id)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", data.id);

        case 11:
          return _context.abrupt("return", null);

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching profile ID:', _context.t0);
          return _context.abrupt("return", null);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
} // テスト用のユーザー名を指定して、プロフィールIDを取得する


var username = 'aaa'; // ここにユーザー名を入力してください

getProfileId(username).then(function (profileId) {
  if (profileId) {
    console.log("TESTCoomand Now\nProfile ID: ".concat(profileId));
  } else {
    console.log('ユーザーが見つかりませんでした。');
  }
})["catch"](function (err) {
  return console.error(err);
});
module.exports = {
  data: new SlashCommandBuilder().setName('mcrole').setDescription('Minecraft ロールを付与します').setDMPermission(false).addStringOption(function (option) {
    return option.setName('edition').setDescription('Minecraft のエディションを選択してください').setRequired(true).addChoices({
      name: 'Java Edition',
      value: 'java'
    }, {
      name: 'Bedrock Edition',
      value: 'bedrock'
    });
  }).addStringOption(function (option) {
    return option.setName('mcname').setDescription('Minecraft のユーザー名を入力してください').setRequired(true);
  }).addStringOption(function (option) {
    return option.setName('read_rules').setDescription('ルールを読みましたか?').setRequired(true).addChoices({
      name: 'yes',
      value: 'yes'
    }, {
      name: 'no',
      value: 'no'
    });
  }),
  execute: function execute(interaction) {
    var edition, mcName, readRules, client, otherChannel, NoficationChannel, row, collector, _row, _collector;

    return regeneratorRuntime.async(function execute$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            edition = interaction.options.getString('edition');
            mcName = interaction.options.getString('mcname');
            readRules = interaction.options.getString('read_rules'); // interactionオブジェクトからclientを取得

            client = interaction.client; // 取得したclientを使用して別のチャンネルにメッセージを送信

            otherChannel = client.channels.cache.get(RoleChannel);
            NoficationChannel = client.channels.cache.get(RoleNofication);

            if (!(edition === "java")) {
              _context10.next = 23;
              break;
            }

            row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('AllowBtn').setLabel('許可').setStyle(3), new ButtonBuilder().setCustomId('DisableBtn').setLabel('拒否').setStyle(4));
            _context10.next = 11;
            return regeneratorRuntime.awrap(otherChannel.send({
              content: "# \u30ED\u30FC\u30EB\u7533\u8ACB\u304C\u6765\u307E\u3057\u305F\n\u7533\u8ACB\u5143 : <@!".concat(interaction.user.id, ">") + '\nユーザーID ```' + interaction.user.id + '```' + "\n\u30A8\u30C7\u30A3\u30B7\u30E7\u30F3: ".concat(edition, "\nMinecraft\u540D: ") + '```' + mcName + '```' + "\n\u30EB\u30FC\u30EB\u78BA\u8A8D: ".concat(readRules),
              components: [row]
            }));

          case 11:
            _context10.prev = 11;
            collector = otherChannel.createMessageComponentCollector();
            collector.on('collect', function _callee2(i) {
              var member, role, main, getUUID, _username, Reason, SendMessage;

              return regeneratorRuntime.async(function _callee2$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      if (!(i.customId === 'AllowBtn')) {
                        _context6.next = 21;
                        break;
                      }

                      // interactionオブジェクトからclientを取得
                      member = interaction.guild.members.cache.get(interaction.user.id); // ロールを取得

                      role = interaction.guild.roles.cache.find(function (role) {
                        return role.name === RoleName;
                      });

                      if (!(edition === "java")) {
                        _context6.next = 19;
                        break;
                      }

                      _context6.prev = 4;

                      main = function main() {
                        var rcon, responses, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step;

                        return regeneratorRuntime.async(function main$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                _context2.next = 2;
                                return regeneratorRuntime.awrap(Rcon.connect({
                                  host: process.env.MC_IP,
                                  port: process.env.MC_PORT,
                                  password: process.env.MC_PASS,
                                  timeout: 5000 // 5秒のタイムアウトを設定

                                }));

                              case 2:
                                rcon = _context2.sent;
                                _context2.t0 = console;
                                _context2.next = 6;
                                return regeneratorRuntime.awrap(rcon.send("list", {
                                  timeout: 5000
                                }));

                              case 6:
                                _context2.t1 = _context2.sent;

                                _context2.t0.log.call(_context2.t0, _context2.t1);

                                _context2.next = 10;
                                return regeneratorRuntime.awrap(Promise.all([rcon.send("whitelist add ".concat(mcName), {
                                  timeout: 5000
                                })]));

                              case 10:
                                responses = _context2.sent;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 14;

                                for (_iterator = responses[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                  response = _step.value;
                                  console.log(response);
                                }

                                _context2.next = 22;
                                break;

                              case 18:
                                _context2.prev = 18;
                                _context2.t2 = _context2["catch"](14);
                                _didIteratorError = true;
                                _iteratorError = _context2.t2;

                              case 22:
                                _context2.prev = 22;
                                _context2.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                                  _iterator["return"]();
                                }

                              case 25:
                                _context2.prev = 25;

                                if (!_didIteratorError) {
                                  _context2.next = 28;
                                  break;
                                }

                                throw _iteratorError;

                              case 28:
                                return _context2.finish(25);

                              case 29:
                                return _context2.finish(22);

                              case 30:
                                rcon.end();

                              case 31:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, null, null, [[14, 18, 22, 30], [23,, 25, 29]]);
                      };

                      getUUID = function getUUID(username) {
                        var _response2, data;

                        return regeneratorRuntime.async(function getUUID$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return regeneratorRuntime.awrap(fetch("https://api.mojang.com/users/profiles/minecraft/".concat(username)));

                              case 3:
                                _response2 = _context3.sent;
                                _context3.next = 6;
                                return regeneratorRuntime.awrap(_response2.json());

                              case 6:
                                data = _context3.sent;

                                if (!(data && data.id)) {
                                  _context3.next = 11;
                                  break;
                                }

                                return _context3.abrupt("return", data.id);

                              case 11:
                                return _context3.abrupt("return", null);

                              case 12:
                                _context3.next = 18;
                                break;

                              case 14:
                                _context3.prev = 14;
                                _context3.t0 = _context3["catch"](0);
                                console.error('Error fetching UUID:', _context3.t0);
                                return _context3.abrupt("return", null);

                              case 18:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, null, null, [[0, 14]]);
                      }; // テスト用のユーザー名を指定して、UUIDを取得する


                      _context6.next = 9;
                      return regeneratorRuntime.awrap(member.roles.add(role));

                    case 9:
                      main()["catch"](function (err) {
                        console.error(err);
                      });
                      _username = mcName; // ここにユーザー名を入力してください

                      getUUID(_username).then(function (uuid) {
                        if (uuid) {
                          // データを保存する関数
                          var saveUserData = function saveUserData(name, userid, mcname, uuid) {
                            var user;
                            return regeneratorRuntime.async(function saveUserData$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    _context4.prev = 0;
                                    _context4.next = 3;
                                    return regeneratorRuntime.awrap(User.create({
                                      name: name,
                                      userid: userid,
                                      mcname: mcname,
                                      uuid: uuid
                                    }));

                                  case 3:
                                    user = _context4.sent;
                                    console.log('User data saved successfully:', user);
                                    _context4.next = 10;
                                    break;

                                  case 7:
                                    _context4.prev = 7;
                                    _context4.t0 = _context4["catch"](0);
                                    console.error('Error saving user data:', _context4.t0);

                                  case 10:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, null, null, [[0, 7]]);
                          }; // データを保存


                          saveUserData(interaction.user.username, interaction.user.id, mcName, uuid); // ボタンが押された後にレスポンスを延期せずに即座に更新する
                          // await i.deferUpdate();

                          i.update({
                            content: '許可ボタンを押されたのでロールを付与しました\nロール剥奪\n' + '```' + "/takerole name:<@!".concat(interaction.user.id, "> role:@\u30AF\u30E9\u30D5\u30BF\u30FC") + '```',
                            components: []
                          });
                          NoficationChannel.send("<@!".concat(interaction.user.id, ">\u3055\u3093\u306E\u30ED\u30FC\u30EB\u306E\u7533\u8ACB\u304C\u8A31\u53EF\u3055\u308C\u307E\u3057\u305F"));
                        } else {
                          console.log('ユーザーが見つかりませんでした。');
                        }
                      })["catch"](function (err) {
                        return console.error(err);
                      });
                      _context6.next = 19;
                      break;

                    case 14:
                      _context6.prev = 14;
                      _context6.t0 = _context6["catch"](4);
                      console.error("ロールを付与できませんでした:", _context6.t0);
                      _context6.next = 19;
                      return regeneratorRuntime.awrap(otherChannel.send("ロールを付与できませんでした。エラーが発生しました。"));

                    case 19:
                      _context6.next = 27;
                      break;

                    case 21:
                      if (!(i.customId === 'DisableBtn')) {
                        _context6.next = 27;
                        break;
                      }

                      //ボタン作成
                      Reason = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('Send').setLabel('送信').setStyle(3));
                      _context6.next = 25;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 25:
                      _context6.next = 27;
                      return regeneratorRuntime.awrap(i.editReply({
                        content: '申請を拒否した理由を送信してください、その後に送信ボタンを教えてください',
                        components: [Reason]
                      }));

                    case 27:
                      ;
                      SendMessage = otherChannel.createMessageComponentCollector(); //拒否メッセージ

                      SendMessage.on('collect', function _callee(i) {
                        var messages, previousMessage;
                        return regeneratorRuntime.async(function _callee$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                if (!(i.customId === 'Send')) {
                                  _context5.next = 11;
                                  break;
                                }

                                _context5.next = 3;
                                return regeneratorRuntime.awrap(otherChannel.messages.fetch({
                                  limit: 1
                                }));

                              case 3:
                                messages = _context5.sent;
                                previousMessage = messages.last();
                                _context5.next = 7;
                                return regeneratorRuntime.awrap(i.deferUpdate());

                              case 7:
                                _context5.next = 9;
                                return regeneratorRuntime.awrap(i.editReply({
                                  content: 'メッセージを送信しました\n**送信内容**\n' + "\u7406\u7531: ".concat(previousMessage.content)
                                }));

                              case 9:
                                _context5.next = 11;
                                return regeneratorRuntime.awrap(NoficationChannel.send("<@!".concat(interaction.user.id, ">\u3055\u3093\u306E\u7533\u8ACB\u306F\u62D2\u5426\u3055\u308C\u307E\u3057\u305F\u3002\n\u7406\u7531: ").concat(previousMessage.content)));

                              case 11:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        });
                      });

                    case 30:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, null, null, [[4, 14]]);
            }); // 確認メッセージ 

            _context10.next = 16;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u30A8\u30C7\u30A3\u30B7\u30E7\u30F3: ".concat(edition, "\nMinecraft\u540D: ") + '```' + mcName + '```' + "\n\u30EB\u30FC\u30EB\u78BA\u8A8D: ".concat(readRules),
              ephemeral: true
            }));

          case 16:
            _context10.next = 21;
            break;

          case 18:
            _context10.prev = 18;
            _context10.t0 = _context10["catch"](11);
            console.log(_context10.t0);

          case 21:
            _context10.next = 38;
            break;

          case 23:
            _row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('AllowBtn').setLabel('許可').setStyle(3), new ButtonBuilder().setCustomId('DisableBtn').setLabel('拒否').setStyle(4)); // ロールの付与などの処理を記述する

            _context10.next = 26;
            return regeneratorRuntime.awrap(otherChannel.send({
              content: "# \u30ED\u30FC\u30EB\u7533\u8ACB\u304C\u6765\u307E\u3057\u305F\n                \n\u7533\u8ACB\u5143 : <@!".concat(interaction.user.id, ">") + '\nユーザーID ```' + interaction.user.id + '```' + "\n\u30A8\u30C7\u30A3\u30B7\u30E7\u30F3: ".concat(edition, "\nMinecraft\u540D: BE_").concat(mcName, "\n\u30EB\u30FC\u30EB\u78BA\u8A8D: ").concat(readRules),
              components: [_row]
            }));

          case 26:
            _context10.next = 28;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u7533\u8ACB\u3092\u9001\u308A\u307E\u3057\u305F\u3002\n**\u78BA\u8A8D**\n\u30A8\u30C7\u30A3\u30B7\u30E7\u30F3: ".concat(edition, "\nMinecraft\u540D: ") + '```BE_' + mcName + '```' + "\n\u30EB\u30FC\u30EB\u78BA\u8A8D: ".concat(readRules),
              ephemeral: true
            }));

          case 28:
            _context10.prev = 28;
            _collector = otherChannel.createMessageComponentCollector();

            _collector.on('collect', function _callee4(i) {
              var member, role, main, Reason, SendMessage;
              return regeneratorRuntime.async(function _callee4$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      if (!(i.customId === 'AllowBtn')) {
                        _context9.next = 24;
                        break;
                      }

                      // interactionオブジェクトからclientを取得
                      member = interaction.guild.members.cache.get(interaction.user.id); // ロールを取得

                      role = interaction.guild.roles.cache.find(function (role) {
                        return role.name === 'クラフター';
                      });

                      if (!(edition === "bedrock")) {
                        _context9.next = 22;
                        break;
                      }

                      _context9.prev = 4;

                      main = function main() {
                        var rcon, responses, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

                        return regeneratorRuntime.async(function main$(_context7) {
                          while (1) {
                            switch (_context7.prev = _context7.next) {
                              case 0:
                                _context7.next = 2;
                                return regeneratorRuntime.awrap(Rcon.connect({
                                  host: process.env.MC_IP,
                                  port: process.env.MC_PORT,
                                  password: process.env.MC_PASS,
                                  timeout: 5000 // 5秒のタイムアウトを設定

                                }));

                              case 2:
                                rcon = _context7.sent;
                                _context7.t0 = console;
                                _context7.next = 6;
                                return regeneratorRuntime.awrap(rcon.send("list", {
                                  timeout: 5000
                                }));

                              case 6:
                                _context7.t1 = _context7.sent;

                                _context7.t0.log.call(_context7.t0, _context7.t1);

                                _context7.next = 10;
                                return regeneratorRuntime.awrap(Promise.all([rcon.send("fwhitelist add ".concat(mcName), {
                                  timeout: 5000
                                })]));

                              case 10:
                                responses = _context7.sent;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context7.prev = 14;

                                for (_iterator2 = responses[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                  response = _step2.value;
                                  console.log(response);
                                }

                                _context7.next = 22;
                                break;

                              case 18:
                                _context7.prev = 18;
                                _context7.t2 = _context7["catch"](14);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context7.t2;

                              case 22:
                                _context7.prev = 22;
                                _context7.prev = 23;

                                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                                  _iterator2["return"]();
                                }

                              case 25:
                                _context7.prev = 25;

                                if (!_didIteratorError2) {
                                  _context7.next = 28;
                                  break;
                                }

                                throw _iteratorError2;

                              case 28:
                                return _context7.finish(25);

                              case 29:
                                return _context7.finish(22);

                              case 30:
                                rcon.end();

                              case 31:
                              case "end":
                                return _context7.stop();
                            }
                          }
                        }, null, null, [[14, 18, 22, 30], [23,, 25, 29]]);
                      };

                      _context9.next = 8;
                      return regeneratorRuntime.awrap(member.roles.add(role));

                    case 8:
                      main()["catch"](function (err) {
                        console.error(err);
                      });
                      _context9.next = 11;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 11:
                      _context9.next = 13;
                      return regeneratorRuntime.awrap(i.update({
                        content: '許可ボタンを押されたのでロールを付与しました\nロール剥奪\n' + '```' + "/takerole name:<@!".concat(interaction.user.id, "> role:\u30AF\u30E9\u30D5\u30BF\u30FC") + '```',
                        components: []
                      }));

                    case 13:
                      _context9.next = 15;
                      return regeneratorRuntime.awrap(NoficationChannel.send("<@!".concat(interaction.user.id, ">\u3055\u3093\u306E\u30ED\u30FC\u30EB\u306E\u7533\u8ACB\u304C\u8A31\u53EF\u3055\u308C\u307E\u3057\u305F")));

                    case 15:
                      _context9.next = 22;
                      break;

                    case 17:
                      _context9.prev = 17;
                      _context9.t0 = _context9["catch"](4);
                      console.error("ロールを付与できませんでした:", _context9.t0);
                      _context9.next = 22;
                      return regeneratorRuntime.awrap(otherChannel.send("ロールを付与できませんでした。エラーが発生しました。"));

                    case 22:
                      _context9.next = 30;
                      break;

                    case 24:
                      if (!(i.customId === 'DisableBtn')) {
                        _context9.next = 30;
                        break;
                      }

                      //ボタン作成
                      Reason = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('Send').setLabel('送信').setStyle(3));
                      _context9.next = 28;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 28:
                      _context9.next = 30;
                      return regeneratorRuntime.awrap(i.editReply({
                        content: '申請を拒否した理由を送信してください、その後に送信ボタンを教えてください',
                        components: [Reason]
                      }));

                    case 30:
                      ;
                      SendMessage = otherChannel.createMessageComponentCollector(); //拒否メッセージ

                      SendMessage.on('collect', function _callee3(i) {
                        var messages, previousMessage;
                        return regeneratorRuntime.async(function _callee3$(_context8) {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                if (!(i.customId === 'Send')) {
                                  _context8.next = 11;
                                  break;
                                }

                                _context8.next = 3;
                                return regeneratorRuntime.awrap(otherChannel.messages.fetch({
                                  limit: 1
                                }));

                              case 3:
                                messages = _context8.sent;
                                previousMessage = messages.last();
                                _context8.next = 7;
                                return regeneratorRuntime.awrap(i.deferUpdate());

                              case 7:
                                _context8.next = 9;
                                return regeneratorRuntime.awrap(i.editReply({
                                  content: 'メッセージを送信しました\n**送信内容**\n' + "\u7406\u7531: ".concat(previousMessage.content)
                                }));

                              case 9:
                                _context8.next = 11;
                                return regeneratorRuntime.awrap(NoficationChannel.send("<@!".concat(interaction.user.id, ">\u3055\u3093\u306E\u7533\u8ACB\u306F\u62D2\u5426\u3055\u308C\u307E\u3057\u305F\u3002\n\u7406\u7531: ").concat(previousMessage.content)));

                              case 11:
                              case "end":
                                return _context8.stop();
                            }
                          }
                        });
                      });

                    case 33:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, null, null, [[4, 17]]);
            }); // 確認メッセージ 


            _context10.next = 33;
            return regeneratorRuntime.awrap(interaction.reply({
              content: "\u30A8\u30C7\u30A3\u30B7\u30E7\u30F3: ".concat(edition, "\nMinecraft\u540D: ") + '```BE_' + mcName + '```' + "\n\u30EB\u30FC\u30EB\u78BA\u8A8D: ".concat(readRules),
              ephemeral: true
            }));

          case 33:
            _context10.next = 38;
            break;

          case 35:
            _context10.prev = 35;
            _context10.t1 = _context10["catch"](28);
            console.log(_context10.t1);

          case 38:
            _context10.next = 45;
            break;

          case 40:
            _context10.prev = 40;
            _context10.t2 = _context10["catch"](0);
            console.log(_context10.t2);
            _context10.next = 45;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'コマンドの実行中にエラーが発生しました!',
              ephemeral: true
            }));

          case 45:
            ;

          case 46:
          case "end":
            return _context10.stop();
        }
      }
    }, null, null, [[0, 40], [11, 18], [28, 35]]);
  }
};