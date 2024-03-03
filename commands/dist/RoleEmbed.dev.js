"use strict";

var _require = require('discord.js'),
    SlashCommandBuilder = _require.SlashCommandBuilder,
    ActionRowBuilder = _require.ActionRowBuilder,
    StringSelectMenuBuilder = _require.StringSelectMenuBuilder,
    ButtonBuilder = _require.ButtonBuilder;

module.exports = {
  data: new SlashCommandBuilder().setName('roleembed').setDescription('Embedのボタンを押すとロールがもらえます'),
  execute: function execute(interaction) {
    var roleOptions, selectMenu, selectRow, sendButton, selectAllRow, collector;
    return regeneratorRuntime.async(function execute$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            // サーバーの全てのロールからセレクトメニューのオプションを作成
            roleOptions = interaction.guild.roles.cache.map(function (role) {
              return {
                label: role.name,
                value: role.id
              };
            }); // セレクトメニューを作成

            selectMenu = new StringSelectMenuBuilder().setCustomId('role_select_menu').setPlaceholder('ロールを選択してください').setMinValues(0).setMaxValues(Math.min(25, roleOptions.length)) // 最大値を25以下に設定
            .addOptions(roleOptions.slice(0, 25)); // 最初の25個のオプションを使用
            // セレクトメニューを含む行を作成

            selectRow = new ActionRowBuilder().addComponents(selectMenu); // 送信ボタンを作成

            sendButton = new ButtonBuilder().setCustomId('send_button').setLabel('全てのロールを追加').setStyle(3); // 全てのロールを選択するボタンを含む行を作成

            selectAllRow = new ActionRowBuilder().addComponents(sendButton); // インタラクションに返信

            _context2.next = 8;
            return regeneratorRuntime.awrap(interaction.reply({
              content: 'ロールを選択してください。',
              components: [selectRow, selectAllRow]
            }));

          case 8:
            // インタラクションのコレクターを設定
            collector = interaction.channel.createMessageComponentCollector();
            collector.on('collect', function _callee(i) {
              var selectedRoles, roles, embed, _selectedRoles, rolesToAdd, memberRoles, rolesToAddFiltered, selectedRoleId, role;

              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(i.customId === 'role_select_menu')) {
                        _context.next = 15;
                        break;
                      }

                      selectedRoles = i.values;
                      roles = selectedRoles.map(function (roleId) {
                        return interaction.guild.roles.cache.get(roleId);
                      });

                      if (roles.length) {
                        _context.next = 5;
                        break;
                      }

                      return _context.abrupt("return");

                    case 5:
                      embed = {
                        title: 'ロールを追加',
                        description: roles.map(function (role) {
                          return "- ".concat(role.name);
                        }).join('\n')
                      }; // インタラクションがまだ返信されていない場合のみ返信を行う

                      if (!(!interaction.deferred && !interaction.replied)) {
                        _context.next = 9;
                        break;
                      }

                      _context.next = 9;
                      return regeneratorRuntime.awrap(interaction.reply({
                        content: '以下のロールを追加しますか？',
                        embeds: [embed],
                        components: [selectAllRow] // ボタンの行を含めて更新

                      }));

                    case 9:
                      _context.next = 11;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 11:
                      _context.next = 13;
                      return regeneratorRuntime.awrap(i.editReply({
                        content: 'ロールを選択しました！',
                        ephemeral: true
                      }));

                    case 13:
                      _context.next = 41;
                      break;

                    case 15:
                      if (!(i.customId === 'send_button')) {
                        _context.next = 34;
                        break;
                      }

                      _selectedRoles = i.message.embeds[0].description.split('\n').map(function (description) {
                        return description.trim().slice(2);
                      });
                      rolesToAdd = _selectedRoles.map(function (roleName) {
                        return interaction.guild.roles.cache.find(function (role) {
                          return role.name === roleName;
                        });
                      });

                      if (rolesToAdd.length) {
                        _context.next = 20;
                        break;
                      }

                      return _context.abrupt("return");

                    case 20:
                      memberRoles = interaction.member.roles.cache;
                      rolesToAddFiltered = rolesToAdd.filter(function (role) {
                        return !memberRoles.has(role.id);
                      });

                      if (!(rolesToAddFiltered.length === 0)) {
                        _context.next = 27;
                        break;
                      }

                      _context.next = 25;
                      return regeneratorRuntime.awrap(interaction.followUp({
                        content: 'あなたはすでにすべてのロールを持っています。',
                        ephemeral: true
                      }));

                    case 25:
                      _context.next = 30;
                      break;

                    case 27:
                      interaction.member.roles.add(rolesToAddFiltered);
                      _context.next = 30;
                      return regeneratorRuntime.awrap(interaction.followUp({
                        content: 'ロールが追加されました！',
                        ephemeral: true
                      }));

                    case 30:
                      _context.next = 32;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 32:
                      _context.next = 41;
                      break;

                    case 34:
                      selectedRoleId = i.customId; // 選択されたロールのIDを取得

                      role = interaction.guild.roles.cache.get(selectedRoleId);

                      if (role) {
                        _context.next = 38;
                        break;
                      }

                      return _context.abrupt("return");

                    case 38:
                      // メンバーにロールを追加
                      interaction.member.roles.add(role);
                      _context.next = 41;
                      return regeneratorRuntime.awrap(i.deferUpdate());

                    case 41:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }
};