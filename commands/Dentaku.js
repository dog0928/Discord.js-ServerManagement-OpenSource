const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const math = require('mathjs');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('dentaku')
      .setDescription('電卓を開きます。'),

  async execute(interaction) {
    const client = interaction.client;

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
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('C')
                .setLabel('C')
                .setStyle(4)
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
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('*')
                .setLabel('*')
                .setStyle(1)
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
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId('+')
                .setLabel('+')
                .setStyle(3)
        );

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('削')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('0')
                .setLabel('0')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('.')
                .setLabel('.')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('%')
                .setLabel('%')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('backspace')
                .setLabel('←')
                .setStyle(2)
        );

    const message = await interaction.reply({ content: '電卓を開きます。', components: [row1, row2, row3, row4], fetchReply: true });

    let expression = '';

    const collector = message.createMessageComponentCollector();

    collector.on('collect', async buttonInteraction => {
      if (buttonInteraction.user.id !== interaction.user.id) return;

      const { customId } = buttonInteraction;

      if (customId === '=') {
        try {
          const result = math.evaluate(expression);
          await buttonInteraction.update({ content: `計算結果: ${result}` });
          expression = `${result}`;
        } catch (error) {
          console.error(error);
          await buttonInteraction.update({ content: '計算中にエラーが発生しました。' });
        }
      } else if (customId === 'C') {
        expression = '';
        await buttonInteraction.update({ content: '式をクリアしました。' });
      } else if (customId === 'backspace') {
        expression = expression.slice(0, -1);
        await buttonInteraction.update({ content: `${expression}` });
      } else if (customId === 'delete') {
        await message.delete();
      } else if (customId !== 'disabled') {
        expression += customId;
        await buttonInteraction.update({ content: `${expression}` });
      }
    });
  },
};
