const { EmbedBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

// InteractionCreate イベントのリスナーを一度だけ登録するためのフラグ
let interactionListenerRegistered = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('埋め込みを作成します')
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('sendchannel')
                .setDescription('お知らせを送信するチャンネル')
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName('imgfile')
                .setDescription('画像を挿入する場合はこれに貼ってください')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const sendchannel = interaction.options.getChannel('sendchannel');
            const imgfileOption = interaction.options.getAttachment('imgfile');
            const imgfile = imgfileOption ? imgfileOption.url : null;

            const client = interaction.client;

            const modal = new ModalBuilder()
                .setCustomId('sendmessage')
                .setTitle('埋め込み');

            const Title = new TextInputBuilder()
                .setCustomId('title')
                .setLabel("埋め込みのタイトル")
                .setStyle(TextInputStyle.Short);

            const Description = new TextInputBuilder()
                .setCustomId('description')
                .setLabel("埋め込みの詳細")
                .setStyle(TextInputStyle.Paragraph);

            const TitleActionRow = new ActionRowBuilder().addComponents(Title);
            const DescriptionActionRow = new ActionRowBuilder().addComponents(Description);

            modal.addComponents(TitleActionRow, DescriptionActionRow);

            await interaction.showModal(modal);

            // InteractionCreate イベントのリスナーを一度だけ登録する
            if (!interactionListenerRegistered) {
                client.on(Events.InteractionCreate, async (receivedInteraction) => {
                    if (!receivedInteraction.isModalSubmit()) return;
                    await receivedInteraction.reply({content: 'Embed作成中...', ephemeral: true})

                    const TitleText = receivedInteraction.fields.getTextInputValue('title');
                    const DescriptionText = receivedInteraction.fields.getTextInputValue('description');

                    const NoficationEmbed = new EmbedBuilder()
                        .setColor("4169e1")
                        .setTitle(TitleText)
                        .setAuthor({
                            name: receivedInteraction.user.username,
                            iconURL: receivedInteraction.user.displayAvatarURL()
                        })
                        .setDescription(DescriptionText)
                        .setImage(imgfile) // 修正点
                        .setTimestamp()
                        .setFooter({ text: `N!BOT`, iconURL: client.user.displayAvatarURL() });

                    await receivedInteraction.editReply({content: `以下のEmbedを${sendchannel}に送信しました`, embeds: [NoficationEmbed], ephemeral: true});
                    await sendchannel.send({embeds: [NoficationEmbed]});
                    // interaction.deferUpdate();  // interaction ではなく receivedInteraction を使用する必要があります
                });

                interactionListenerRegistered = true;
            }
        } catch(e) {
            console.error(e);
        }
    },
};
