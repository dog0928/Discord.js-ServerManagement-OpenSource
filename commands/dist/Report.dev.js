"use strict";

// report.js
var _require = require('discord.js'),
    ModalBuilder = _require.ModalBuilder,
    TextInputBuilder = _require.TextInputBuilder,
    TextInputStyle = _require.TextInputStyle,
    ActionRowBuilder = _require.ActionRowBuilder,
    EmbedBuilder = _require.EmbedBuilder,
    ContextMenuCommandBuilder = _require.ContextMenuCommandBuilder;

module.exports = {
  data: new ContextMenuCommandBuilder().setName('report').setType(ContextMenuCommandType.Message),
  execute: function execute(interaction) {
    var modal, Title, TitleActionRow, NoficationEmbed;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // モーダル定義
            modal = new ModalBuilder().setCustomId('report').setTitle('報告');
            Title = new TextInputBuilder().setCustomId('title').setTitle('報告した理由').setStyle(TextInputStyle.Paragraph);
            TitleActionRow = new ActionRowBuilder().addComponents(Title);
            modal.addComponents(TitleActionRow);
            _context2.next = 6;
            return regeneratorRuntime.awrap(interaction.showModal(modal));

          case 6:
            // InteractionCreate イベントのリスナーを一度だけ登録する
            if (!interactionListenerRegistered) {
              client.on(Events.InteractionCreate, function _callee(receivedInteraction) {
                var TitleText;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (receivedInteraction.isModalSubmit()) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return");

                      case 2:
                        _context.next = 4;
                        return regeneratorRuntime.awrap(receivedInteraction.reply({
                          content: "報告を作成中...",
                          ephemeral: true
                        }));

                      case 4:
                        TitleText = receivedInteraction.fields.getTextInputValue('title');

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });
            }

            ;
            NoficationEmbed = new EmbedBuilder().setColor("ff0000").setTitle("報告").setAuthor({
              name: receivedInteraction.user.username,
              iconURL: receivedInteraction.user.displayAvatarURL()
            }).setDescription(TitleText).setTimestamp().setFooter({
              text: "N!BOT",
              iconURL: client.user.displayAvatarURL()
            });

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
  /* コンテキストメニューの処理
  reportMessage(interaction) {
      // 省略 
  }*/

};