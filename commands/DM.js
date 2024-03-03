const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('senddm')
        .setDescription('指定したユーザーにダイレクトメッセージを送信します。')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ユーザーを選択')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('送信するメッセージ')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const userMessage = interaction.options.getString('message');

        if (!user) return interaction.reply({ content: 'そのユーザーは見つかりませんでした。', ephemeral: true });

        user.send(userMessage)
            .then(() => interaction.reply({ content: `**N!BOTを使用してDM送信通知**\n<@!${interaction.user.id}>さんが${user}さんにDMを送信しました\n送信内容: ${userMessage}`}))
            .catch(error => {
                console.error(`ダイレクトメッセージを送信できませんでした: ${error}`);
                interaction.reply({ content: 'メッセージを送信できませんでした。ユーザーの設定を確認してください。', ephemeral: true });
            });
    },
};
