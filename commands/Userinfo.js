const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserInfo } = require('../user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('指定したユーザーの情報を表示します。')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ユーザーを選択')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        if (!user) return interaction.reply({ content: 'ユーザーが見つかりませんでした。', ephemeral: true });

        const userId = user.id;
        const userInfo = await getUserInfo(userId);
        const client = interaction.client;
        const roles = interaction.options.getMember('user').roles.cache.map(role => role.name === '@everyone' ? '@everyone' : `<@&${role.id}>`).join(', ') || 'ロールなし';

        if (userInfo) {
            const namemcurl = "https://ja.namemc.com/profile/" + userInfo.uuid;
            const embed = new EmbedBuilder()
                .setColor("006400")
                .setTitle(`UserInfo`)
                .setURL(namemcurl)
                .setAuthor({name: user.username, iconURL: user.displayAvatarURL(), url: namemcurl })

                .setDescription(`:Authenticated:${user}の詳細です`)
                .addFields(
                    { name: `UserID`, value: '```' + userId + '```'},
                    { name: `UUID`, value: '```' + userInfo.uuid + '```'},
                    { name: `MCName`, value: '```' + userInfo.mcname + '```'},
                    { name: 'Roles', value: roles }
                )
                .setTimestamp()
                .setFooter({ text: `N!BOT`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({embeds: [embed], ephemeral: true});
        } else {
            const nouuidembed = new EmbedBuilder()
                .setColor("006400")
                .setTitle(`UserInfo`)
                .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})

                .setDescription(`${user}の詳細です`)
                .addFields(
                    { name: `UserID`, value: '```' + userId + '```'},
                    { name: 'Roles', value: roles }
                )
                .setTimestamp()
                .setFooter({ text: `N!BOT`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({embeds: [nouuidembed], ephemeral: true});
        }
    },
};
