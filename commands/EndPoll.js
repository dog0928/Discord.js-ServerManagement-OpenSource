const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endpoll')
    .setDescription('投票を終了し、結果を表示します')
    .addStringOption(option =>
      option.setName('channel_id')
        .setDescription('投票メッセージが存在するチャンネルのID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('投票メッセージのID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const channelId = interaction.options.getString('channel_id');
    const messageId = interaction.options.getString('message_id');

    const channel = interaction.guild.channels.cache.get(channelId);
    if (!channel) return interaction.reply("チャンネルIDの指定が間違っているか、チャンネルが見つかりません。");

    const message = await channel.messages.fetch(messageId).catch(err => {
      console.error(err);
      return null;
    });
    if (!message) return interaction.reply("メッセージIDの指定が間違っているか、メッセージが見つかりません。");
    if (message.author.id !== interaction.client.user.id) return;

    const embed = message.embeds[0];
    if (!embed || !embed.title || !embed.description)
      return interaction.reply("その投票は無効です。");

    // リアクションを取得
    const reactions = message.reactions.cache;

    // 投票結果の作成
    const result = embed.description.split('\n').map(field => {
        const emoji = field.split(' ')[0];
        const choice = field.split(' ')[1];
        const reaction = reactions.find(reaction => reaction._emoji.name === emoji);
        const count = reaction ? reaction.count : 0; // 自分自身のリアクションを除外
        return { emoji, choice, count };
      });

    const resultMessage = result.map(n => `**${n.choice}**\n${n.emoji}：${n.count}票`).join("\n");

    // 投票結果を実行されたチャンネルに送信
    const resultReply = await interaction.channel.send(`## **${embed.title}** の投票結果：\n${resultMessage}`);
    
    // 投票メッセージを編集して終了を示す
    message.edit({ content: `この投票は終了しました。\n[**結果のメッセージリンク**](https://discord.com/channels/${interaction.guild.id}/${channelId}/${resultReply.id})`, embeds: [] });
    
    // 元の投票メッセージのリアクションをすべて削除
    message.reactions.removeAll().catch(error => console.error('リアクションを削除できませんでした:', error));
    
    interaction.reply({content:"投票が終了し、結果が送信されました。",ephemeral: true});
  }
};
