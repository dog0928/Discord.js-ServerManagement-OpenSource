"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var util = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder().setName('check').setDescription('Minecraftサーバーの状態を確認します').addStringOption(function (option) {
    return option.setName('ip').setDescription('チェックするサーバーアドレス').setRequired(false);
  }),
  execute: function execute(interaction) {
    var serverAddress, serverStatus, players, replyMessage;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            serverAddress = interaction.options.getString('ip') || 'mc.pocketen.com';
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(util.status(serverAddress));

          case 4:
            serverStatus = _context.sent;
            console.log(serverStatus);
            players = serverStatus.players.online > 0 ? serverStatus.players.online : '0';
            replyMessage = "\n        **Minecraft\u30B5\u30FC\u30D0\u30FC\u306E\u72B6\u614B**\n        \u30B5\u30FC\u30D0\u30FC\u30A2\u30C9\u30EC\u30B9: ".concat(serverAddress, "\n        \u30AA\u30F3\u30E9\u30A4\u30F3\u30D7\u30EC\u30A4\u30E4\u30FC\u6570: ").concat(players, "/").concat(serverStatus.players.max, "\n        \u30D0\u30FC\u30B8\u30E7\u30F3: ").concat(serverStatus.version.name, "\n        MOTD: ").concat(serverStatus.motd.clean, "\n      ");
            _context.next = 10;
            return regeneratorRuntime.awrap(interaction.reply(replyMessage));

          case 10:
            _context.next = 23;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

            if (!(_context.t0.code === 'ENOTFOUND' || _context.t0.code === 'ETIMEDOUT')) {
              _context.next = 20;
              break;
            }

            _context.next = 18;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'サーバーが起動していないか、間違ったIPアドレスを指定しています。',
              ephemeral: true
            }));

          case 18:
            _context.next = 22;
            break;

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'Minecraftサーバーの状態を取得できませんでした。',
              ephemeral: true
            }));

          case 22:
            return _context.abrupt("return");

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 12]]);
  }
};