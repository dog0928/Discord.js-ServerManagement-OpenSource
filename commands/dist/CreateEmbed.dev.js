"use strict";

var _require = require('discord.js'),
    EmbedBuilder = _require.EmbedBuilder,
    ActionRowBuilder = _require.ActionRowBuilder,
    Events = _require.Events,
    ModalBuilder = _require.ModalBuilder,
    TextInputBuilder = _require.TextInputBuilder,
    TextInputStyle = _require.TextInputStyle;

var _require2 = require('@discordjs/builders'),
    SlashCommandBuilder = _require2.SlashCommandBuilder; // InteractionCreate イベントのリスナーを一度だけ登録するためのフラグ


var interactionListenerRegistered = false;
module.exports = {
  data: new SlashCommandBuilder().setName('embed').setDescription('埋め込みを作成します').setDMPermission(false).addChannelOption(function (option) {
    return option.setName('sendchannel').setDescription('お知らせを送信するチャンネル').setRequired(true);
  }).addAttachmentOption(function (option) {
    return option.setName('imgfile').setDescription('画像を挿入する場合はこれに貼ってください').setRequired(false);
  }),
  execute: function execute(interaction) {
    var sendchannel, imgfileOption, imgfile, client, modal, Title, Description, TitleActionRow, DescriptionActionRow;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            sendchannel = interaction.options.getChannel('sendchannel');
            imgfileOption = interaction.options.getAttachment('imgfile');
            imgfile = imgfileOption ? imgfileOption.url : null;
            client = interaction.client;
            modal = new ModalBuilder().setCustomId('sendmessage').setTitle('埋め込み');
            Title = new TextInputBuilder().setCustomId('title').setLabel("埋め込みのタイトル").setStyle(TextInputStyle.Short);
            Description = new TextInputBuilder().setCustomId('description').setLabel("埋め込みの詳細").setStyle(TextInputStyle.Paragraph);
            TitleActionRow = new ActionRowBuilder().addComponents(Title);
            DescriptionActionRow = new ActionRowBuilder().addComponents(Description);
            modal.addComponents(TitleActionRow, DescriptionActionRow);
            _context2.next = 13;
            return regeneratorRuntime.awrap(interaction.showModal(modal));

          case 13:
            // InteractionCreate イベントのリスナーを一度だけ登録する
            if (!interactionListenerRegistered) {
              client.on(Events.InteractionCreate, function _callee(receivedInteraction) {
                var TitleText, DescriptionText, NoficationEmbed;
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
                          content: 'Embed作成中...',
                          ephemeral: true
                        }));

                      case 4:
                        TitleText = receivedInteraction.fields.getTextInputValue('title');
                        DescriptionText = receivedInteraction.fields.getTextInputValue('description');
                        NoficationEmbed = new EmbedBuilder().setColor("4169e1").setTitle(TitleText).setAuthor({
                          name: receivedInteraction.user.username,
                          iconURL: receivedInteraction.user.displayAvatarURL()
                        }).setDescription(DescriptionText).setImage(imgfile) // 修正点
                        .setTimestamp().setFooter({
                          text: "N!BOT",
                          iconURL: client.user.displayAvatarURL()
                        });
                        _context.next = 9;
                        return regeneratorRuntime.awrap(receivedInteraction.editReply({
                          content: "\u4EE5\u4E0B\u306EEmbed\u3092".concat(sendchannel, "\u306B\u9001\u4FE1\u3057\u307E\u3057\u305F"),
                          embeds: [NoficationEmbed],
                          ephemeral: true
                        }));

                      case 9:
                        _context.next = 11;
                        return regeneratorRuntime.awrap(sendchannel.send({
                          embeds: [NoficationEmbed]
                        }));

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });
              interactionListenerRegistered = true;
            }

            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 16]]);
  }
};