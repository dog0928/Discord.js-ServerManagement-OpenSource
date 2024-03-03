"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('../config.json'),
    Maintenance_Channel = _require2.Maintenance_Channel,
    Nofication_RoleId = _require2.Nofication_RoleId;

var _require3 = require("rcon-client"),
    Rcon = _require3.Rcon;

require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder().setName('maintenance').setDescription('Maintenanceモードのオンオフ切り替え').setDMPermission(false).addStringOption(function (option) {
    return option.setName('maintenance').setDescription('Minecraft のエディションを選択してください').setRequired(true).addChoices({
      name: 'ON',
      value: 'on'
    }, {
      name: 'OFF',
      value: 'off'
    });
  }),
  execute: function execute(interaction) {
    var client, Maintenance, otherChannel, main, _main;

    return regeneratorRuntime.async(function execute$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {
              // interactionオブジェクトからclientを取得
              client = interaction.client;
              Maintenance = interaction.options.getString('maintenance');
              otherChannel = client.channels.cache.get(Maintenance_Channel);

              if (Maintenance === "on") {
                main = function main() {
                  var rcon, responses, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step;

                  return regeneratorRuntime.async(function main$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return regeneratorRuntime.awrap(Rcon.connect({
                            host: process.env.MC_IP,
                            port: process.env.MC_PORT,
                            password: process.env.MC_PASS,
                            timeout: 5000 // 5秒のタイムアウトを設定

                          }));

                        case 2:
                          rcon = _context.sent;
                          _context.t0 = console;
                          _context.next = 6;
                          return regeneratorRuntime.awrap(rcon.send("list", {
                            timeout: 5000
                          }));

                        case 6:
                          _context.t1 = _context.sent;

                          _context.t0.log.call(_context.t0, _context.t1);

                          _context.next = 10;
                          return regeneratorRuntime.awrap(Promise.all([rcon.send("maintenance on", {
                            timeout: 5000
                          }) // ヘルプコマンドのタイムアウトを5秒に設定
                          ]));

                        case 10:
                          responses = _context.sent;
                          _iteratorNormalCompletion = true;
                          _didIteratorError = false;
                          _iteratorError = undefined;
                          _context.prev = 14;

                          for (_iterator = responses[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            response = _step.value;
                            console.log(response);
                          }

                          _context.next = 22;
                          break;

                        case 18:
                          _context.prev = 18;
                          _context.t2 = _context["catch"](14);
                          _didIteratorError = true;
                          _iteratorError = _context.t2;

                        case 22:
                          _context.prev = 22;
                          _context.prev = 23;

                          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                            _iterator["return"]();
                          }

                        case 25:
                          _context.prev = 25;

                          if (!_didIteratorError) {
                            _context.next = 28;
                            break;
                          }

                          throw _iteratorError;

                        case 28:
                          return _context.finish(25);

                        case 29:
                          return _context.finish(22);

                        case 30:
                          rcon.end();

                        case 31:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, null, null, [[14, 18, 22, 30], [23,, 25, 29]]);
                };

                main()["catch"](function (err) {
                  console.error(err);
                });
                interaction.reply({
                  content: "Maintenanceモードをオンにしました",
                  ephemeral: true
                });
                otherChannel.send("<@&".concat(Nofication_RoleId, ">\nMaintenance\u30E2\u30FC\u30C9\u304C\u30AA\u30F3\u306B\u306A\u308A\u307E\u3057\u305F"));
              } else {
                _main = function _main() {
                  var rcon, responses, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

                  return regeneratorRuntime.async(function _main$(_context2) {
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
                          return regeneratorRuntime.awrap(Promise.all([rcon.send("maintenance off", {
                            timeout: 5000
                          }) // ヘルプコマンドのタイムアウトを5秒に設定
                          ]));

                        case 10:
                          responses = _context2.sent;
                          _iteratorNormalCompletion2 = true;
                          _didIteratorError2 = false;
                          _iteratorError2 = undefined;
                          _context2.prev = 14;

                          for (_iterator2 = responses[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            response = _step2.value;
                            console.log(response);
                          }

                          _context2.next = 22;
                          break;

                        case 18:
                          _context2.prev = 18;
                          _context2.t2 = _context2["catch"](14);
                          _didIteratorError2 = true;
                          _iteratorError2 = _context2.t2;

                        case 22:
                          _context2.prev = 22;
                          _context2.prev = 23;

                          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                            _iterator2["return"]();
                          }

                        case 25:
                          _context2.prev = 25;

                          if (!_didIteratorError2) {
                            _context2.next = 28;
                            break;
                          }

                          throw _iteratorError2;

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

                _main()["catch"](function (err) {
                  console.error(err);
                });

                interaction.reply({
                  content: "Maintenanceモードをオフにしました",
                  ephemeral: true
                });
                otherChannel.send("<@&".concat(Nofication_RoleId, ">\nMaintenance\u30E2\u30FC\u30C9\u304C\u30AA\u30D5\u306B\u306A\u308A\u307E\u3057\u305F"));
              }
            } catch (e) {
              console.log(e);
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};