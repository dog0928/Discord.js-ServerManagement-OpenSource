const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleembed')
        .setDescription('Embedのボタンを押すとロールがもらえます'),
    async execute(interaction) {
        try {
            // サーバーの全てのロールからセレクトメニューのオプションを作成
            const roleOptions = interaction.guild.roles.cache.map(role => ({
                label: role.name,
                value: role.id
            }));

            // セレクトメニューを作成
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('role_select_menu')
                .setPlaceholder('ロールを選択してください')
                .setMinValues(0)
                .setMaxValues(Math.min(25, roleOptions.length)) // 最大値を25以下に設定
                .addOptions(roleOptions.slice(0, 25)); // 最初の25個のオプションを使用

            // セレクトメニューを含む行を作成
            const selectRow = new ActionRowBuilder().addComponents(selectMenu);

            // 送信ボタンを作成
            const sendButton = new ButtonBuilder()
                .setCustomId('send_button')
                .setLabel('全てのロールを追加')
                .setStyle(3);

            // 全てのロールを選択するボタンを含む行を作成
            const selectAllRow = new ActionRowBuilder().addComponents(sendButton);

            // インタラクションに返信
            await interaction.reply({
                content: 'ロールを選択してください。',
                components: [selectRow, selectAllRow]
            });

            // インタラクションのコレクターを設定
            const collector = interaction.channel.createMessageComponentCollector();
            collector.on('collect', async i => {
                if (i.customId === 'role_select_menu') {
                    const selectedRoles = i.values;
                    const roles = selectedRoles.map(roleId => interaction.guild.roles.cache.get(roleId));

                    if (!roles.length) return;

                    const embed = {
                        title: 'ロールを追加',
                        description: roles.map(role => `- ${role.name}`).join('\n'),
                    };

                    // インタラクションがまだ返信されていない場合のみ返信を行う
                    if (!interaction.deferred && !interaction.replied) {
                        await interaction.reply({
                            content: '以下のロールを追加しますか？',
                            embeds: [embed],
                            components: [selectAllRow] // ボタンの行を含めて更新
                        });
                    }
                    await i.deferUpdate();
                    // ボットが選択に反応する
                    await i.editReply({ content: 'ロールを選択しました！', ephemeral: true });
                } else if (i.customId === 'send_button') {
                    const selectedRoles = i.message.embeds[0].description.split('\n').map(description => description.trim().slice(2));
                    const rolesToAdd = selectedRoles.map(roleName => interaction.guild.roles.cache.find(role => role.name === roleName));
                    if (!rolesToAdd.length) return;

                    const memberRoles = interaction.member.roles.cache;
                    const rolesToAddFiltered = rolesToAdd.filter(role => !memberRoles.has(role.id));

                    if (rolesToAddFiltered.length === 0) {
                        await interaction.followUp({ content: 'あなたはすでにすべてのロールを持っています。', ephemeral: true });
                    } else {
                        interaction.member.roles.add(rolesToAddFiltered);
                        await interaction.followUp({ content: 'ロールが追加されました！', ephemeral: true });
                    }

                    await i.deferUpdate();
                } else {
                    const selectedRoleId = i.customId; // 選択されたロールのIDを取得
                    const role = interaction.guild.roles.cache.get(selectedRoleId);
                    if (!role) return;

                    // メンバーにロールを追加
                    interaction.member.roles.add(role);
                    await i.deferUpdate();
                }
            });
    
        } catch (e) {
            console.error(e);
        }
    }
};
