const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dentaku')
    .setDescription('電卓を開きます。'),

  async execute(interaction) {
    const client = interaction.client; // interactionからclientオブジェクトを取得

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('7')
          .setLabel('7')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('8')
          .setLabel('8')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('9')
          .setLabel('9')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('=')
          .setLabel('=')
          .setStyle(1), // 結果を表示するボタン
        new ButtonBuilder()
          .setCustomId('C')
          .setLabel('C')
          .setStyle(4) // クリアボタン
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('4')
          .setLabel('4')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('5')
          .setLabel('5')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('6')
          .setLabel('6')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('/')
          .setLabel('/')
          .setStyle(1), // 割り算ボタン
        new ButtonBuilder()
          .setCustomId('*')
          .setLabel('*')
          .setStyle(1) // 掛け算ボタン
      );

    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('1')
          .setLabel('1')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('2')
          .setLabel('2')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('3')
          .setLabel('3')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('-')
          .setLabel('-')
          .setStyle(3), // 引き算ボタン
        new ButtonBuilder()
          .setCustomId('+')
          .setLabel('+')
          .setStyle(3), // 足し算ボタン
      );

    const row4 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('delete')
          .setLabel('削')
          .setStyle(2), // バックスペースボタン
        new ButtonBuilder()
          .setCustomId('0')
          .setLabel('0')
          .setStyle(1), // 0ボタン
        new ButtonBuilder()
          .setCustomId('.')
          .setLabel('.')
          .setStyle(1), // 小数点ボタン
        new ButtonBuilder()
          .setCustomId('%')
          .setLabel('%')
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId('backspace')
          .setLabel('←')
          .setStyle(2) // バックスペースボタン
      );

    const message = await interaction.reply({ content: '電卓を開きます。', components: [row1, row2, row3, row4], fetchReply: true });

    let expression = '';

    const collector = message.createMessageComponentCollector();

    collector.on('collect', async buttonInteraction => {
      if (buttonInteraction.user.id !== interaction.user.id) return;

      const { customId } = buttonInteraction;

      if (customId === '=') {
        try {
          const result = eval(expression);
          await buttonInteraction.update({ content: `計算結果: ${result}` });
          expression = `${result}`; // 計算結果を新しい式の最初に置く
        } catch (error) {
          console.error(error);
          await buttonInteraction.update({ content: '計算中にエラーが発生しました。' });
        }
      } else if (customId === 'C') {
        expression = '';
        await buttonInteraction.update({ content: '式をクリアしました。' });
      } else if (customId === 'backspace') {
        expression = expression.slice(0, -1); // 末尾の一文字を削除
        await buttonInteraction.update({ content: `${expression}` });
      } else if (customId === 'delete') {
        // メッセージを削除
        await message.delete();
      } else if (customId !== 'disabled') { // disabledボタン以外の場合のみ処理を実行
        expression += customId;
        await buttonInteraction.update({ content: `${expression}` });
      }
    });
  },
};
