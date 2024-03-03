"use strict";

var _require = require('@discordjs/builders'),
    SlashCommandBuilder = _require.SlashCommandBuilder;

var _require2 = require('discord.js'),
    ActionRowBuilder = _require2.ActionRowBuilder,
    ButtonBuilder = _require2.ButtonBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('dentaku').setDescription('電卓を開きます。'),
  execute: function execute(interaction) {
    var client, row1, row2, row3, row4, message, expression, collector;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = interaction.client; // interactionからclientオブジェクトを取得

            row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('7').setLabel('7').setStyle(1), new ButtonBuilder().setCustomId('8').setLabel('8').setStyle(1), new ButtonBuilder().setCustomId('9').setLabel('9').setStyle(1), new ButtonBuilder().setCustomId('=').setLabel('=').setStyle(1), // 結果を表示するボタン
            new ButtonBuilder().setCustomId('C').setLabel('C').setStyle(4) // クリアボタン
            );
            row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('4').setLabel('4').setStyle(1), new ButtonBuilder().setCustomId('5').setLabel('5').setStyle(1), new ButtonBuilder().setCustomId('6').setLabel('6').setStyle(1), new ButtonBuilder().setCustomId('/').setLabel('/').setStyle(1), // 割り算ボタン
            new ButtonBuilder().setCustomId('*').setLabel('*').setStyle(1) // 掛け算ボタン
            );
            row3 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('1').setLabel('1').setStyle(1), new ButtonBuilder().setCustomId('2').setLabel('2').setStyle(1), new ButtonBuilder().setCustomId('3').setLabel('3').setStyle(1), new ButtonBuilder().setCustomId('-').setLabel('-').setStyle(3), // 引き算ボタン
            new ButtonBuilder().setCustomId('+').setLabel('+').setStyle(3) // 足し算ボタン
            );
            row4 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('delete').setLabel('削').setStyle(2), // バックスペースボタン
            new ButtonBuilder().setCustomId('0').setLabel('0').setStyle(1), // 0ボタン
            new ButtonBuilder().setCustomId('.').setLabel('.').setStyle(1), // 小数点ボタン
            new ButtonBuilder().setCustomId('%').setLabel('%').setStyle(2), new ButtonBuilder().setCustomId('backspace').setLabel('←').setStyle(2) // バックスペースボタン
            );
            _context2.next = 7;
            return regeneratorRuntime.awrap(interaction.reply({
              content: '電卓を開きます。',
              components: [row1, row2, row3, row4],
              fetchReply: true
            }));

          case 7:
            message = _context2.sent;
            expression = '';
            collector = message.createMessageComponentCollector();
            collector.on('collect', function _callee(buttonInteraction) {
              var customId, result;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(buttonInteraction.user.id !== interaction.user.id)) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt("return");

                    case 2:
                      customId = buttonInteraction.customId;

                      if (!(customId === '=')) {
                        _context.next = 18;
                        break;
                      }

                      _context.prev = 4;
                      result = eval(expression);
                      _context.next = 8;
                      return regeneratorRuntime.awrap(buttonInteraction.update({
                        content: "\u8A08\u7B97\u7D50\u679C: ".concat(result)
                      }));

                    case 8:
                      expression = "".concat(result); // 計算結果を新しい式の最初に置く

                      _context.next = 16;
                      break;

                    case 11:
                      _context.prev = 11;
                      _context.t0 = _context["catch"](4);
                      console.error(_context.t0);
                      _context.next = 16;
                      return regeneratorRuntime.awrap(buttonInteraction.update({
                        content: '計算中にエラーが発生しました。'
                      }));

                    case 16:
                      _context.next = 39;
                      break;

                    case 18:
                      if (!(customId === 'C')) {
                        _context.next = 24;
                        break;
                      }

                      expression = '';
                      _context.next = 22;
                      return regeneratorRuntime.awrap(buttonInteraction.update({
                        content: '式をクリアしました。'
                      }));

                    case 22:
                      _context.next = 39;
                      break;

                    case 24:
                      if (!(customId === 'backspace')) {
                        _context.next = 30;
                        break;
                      }

                      expression = expression.slice(0, -1); // 末尾の一文字を削除

                      _context.next = 28;
                      return regeneratorRuntime.awrap(buttonInteraction.update({
                        content: "".concat(expression)
                      }));

                    case 28:
                      _context.next = 39;
                      break;

                    case 30:
                      if (!(customId === 'delete')) {
                        _context.next = 35;
                        break;
                      }

                      _context.next = 33;
                      return regeneratorRuntime.awrap(message["delete"]());

                    case 33:
                      _context.next = 39;
                      break;

                    case 35:
                      if (!(customId !== 'disabled')) {
                        _context.next = 39;
                        break;
                      }

                      // disabledボタン以外の場合のみ処理を実行
                      expression += customId;
                      _context.next = 39;
                      return regeneratorRuntime.awrap(buttonInteraction.update({
                        content: "".concat(expression)
                      }));

                    case 39:
                    case "end":
                      return _context.stop();
                  }
                }
              }, null, null, [[4, 11]]);
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};