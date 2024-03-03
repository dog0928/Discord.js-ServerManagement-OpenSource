const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('takerole')
    .setDescription('ロール剥奪')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('ユーザーをメンションしてください')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('ロールをメンションしてください')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'このコマンドを使用するには管理者の権限が必要です。', ephemeral: true });
    }

    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!user) {
      return interaction.reply({ content: '指定されたユーザーが見つかりませんでした。', ephemeral: true });
    }
    if (!role) {
      return interaction.reply({ content: '指定されたロールが見つかりませんでした。', ephemeral: true });
    }

    try {
      await user.roles.remove(role);
      await interaction.reply({ content: 'ロール剥奪が完了しました。'});
    } catch (error) {
      console.error('ロール剥奪中にエラーが発生しました:', error);
      await interaction.reply({ content: 'ロール剥奪中にエラーが発生しました。', ephemeral: true });
    }
  },
};
