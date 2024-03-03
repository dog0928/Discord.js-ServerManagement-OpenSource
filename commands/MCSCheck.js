const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Minecraftサーバーの状態を確認します')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('チェックするサーバーアドレス')
        .setRequired(false)
    ),
  async execute(interaction) {
    const serverAddress = interaction.options.getString('ip') || 'mc.pocketen.com';

    try {
      const serverStatus = await util.status(serverAddress);
      console.log(serverStatus);
      const players = (serverStatus.players.online > 0) ? serverStatus.players.online : '0';

      const replyMessage = `
        **Minecraftサーバーの状態**
        サーバーアドレス: ${serverAddress}
        オンラインプレイヤー数: ${players}/${serverStatus.players.max}
        バージョン: ${serverStatus.version.name}
        MOTD: ${serverStatus.motd.clean}
      `;

      await interaction.reply(replyMessage);
    } catch (error) {
      console.error(error);
      if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        await interaction.reply({content:'サーバーが起動していないか、間違ったIPアドレスを指定しています。', ephemeral: true});
      } else {
        await interaction.reply({content:'Minecraftサーバーの状態を取得できませんでした。', ephemeral: true});
      }
      return; // コマンド実行を中止
    }
  },
};
