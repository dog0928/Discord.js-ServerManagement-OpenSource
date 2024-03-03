"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    EmbedBuilder = _require.EmbedBuilder;

var _require2 = require('../user'),
    getUserInfo = _require2.getUserInfo;

module.exports = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('指定したユーザーの情報を表示します。').addUserOption(function (option) {
    return option.setName('user').setDescription('ユーザーを選択').setRequired(true);
  }),
  execute: function execute(interaction) {
    var user, userId, userInfo, client, roles, namemcurl, embed, nouuidembed;
    return regeneratorRuntime.async(function execute$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = interaction.options.getUser('user');

            if (user) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", interaction.reply({
              content: 'ユーザーが見つかりませんでした。',
              ephemeral: true
            }));

          case 3:
            userId = user.id;
            _context.next = 6;
            return regeneratorRuntime.awrap(getUserInfo(userId));

          case 6:
            userInfo = _context.sent;
            client = interaction.client;
            roles = interaction.options.getMember('user').roles.cache.map(function (role) {
              return role.name === '@everyone' ? '@everyone' : "<@&".concat(role.id, ">");
            }).join(', ') || 'ロールなし';

            if (userInfo) {
              namemcurl = "https://ja.namemc.com/profile/" + userInfo.uuid;
              embed = new EmbedBuilder().setColor("006400").setTitle("UserInfo").setURL(namemcurl).setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL(),
                url: namemcurl
              }).setDescription(":Authenticated:".concat(user, "\u306E\u8A73\u7D30\u3067\u3059")).addFields({
                name: "UserID",
                value: '```' + userId + '```'
              }, {
                name: "UUID",
                value: '```' + userInfo.uuid + '```'
              }, {
                name: "MCName",
                value: '```' + userInfo.mcname + '```'
              }, {
                name: 'Roles',
                value: roles
              }).setTimestamp().setFooter({
                text: "N!BOT",
                iconURL: client.user.displayAvatarURL()
              });
              interaction.reply({
                embeds: [embed],
                ephemeral: true
              });
            } else {
              nouuidembed = new EmbedBuilder().setColor("006400").setTitle("UserInfo").setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
              }).setDescription("".concat(user, "\u306E\u8A73\u7D30\u3067\u3059")).addFields({
                name: "UserID",
                value: '```' + userId + '```'
              }, {
                name: 'Roles',
                value: roles
              }).setTimestamp().setFooter({
                text: "N!BOT",
                iconURL: client.user.displayAvatarURL()
              });
              interaction.reply({
                embeds: [nouuidembed],
                ephemeral: true
              });
            }

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};