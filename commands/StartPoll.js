const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

// グローバル変数として、現在の投票のメッセージIDを保持する変数を定義
let currentPollId = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('投票を開始します')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('投票のタイトル')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('a')
        .setDescription('候補1を入力してください')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('b')
        .setDescription('候補2を入力してください')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('c')
        .setDescription('候補3を入力してください')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('d')
        .setDescription('候補4を入力してください')
        .setRequired(false)
    ),
  async execute(interaction) {
    // interactionオブジェクトからclientを取得
    const client = interaction.client;

    const emojis = ['🇦', '🇧', '🇨', '🇩'];
    const title = interaction.options.getString('title');
    const a = interaction.options.getString('a');
    const b = interaction.options.getString('b');
    const c = interaction.options.getString('c');
    const d = interaction.options.getString('d');
    const choices = [a, b, c, d].filter(Boolean); // 空でない候補のみ抽出
    const copytocommand = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('copypollcommand')
          .setLabel('Copy Command')
          .setStyle(2),
      );

    const embed = new EmbedBuilder().setTitle(title).setDescription(choices.map((c, i) => `${emojis[i]} ${c}`).join('\n'));
    const poll = await interaction.channel.send({ embeds: [embed],components:[copytocommand] });

    emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji));
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('poll_command_button')
          .setLabel('集計')
          .setStyle(2),
        new ButtonBuilder()
          .setCustomId('poll_delete_button')
          .setLabel('削除')
          .setStyle(4),
      );
      
    // 新しい投票が始まったので、現在の投票IDをリセットする
    currentPollId = poll.id;

    await interaction.reply({ content: `集計時は ` + '```' + `/endpoll channel_id:${poll.channel.id} message_id:${poll.id}` + '```' + `と送信してください。\nそれか以下のボタンを教えてください`, components: [buttonRow], ephemeral: true });
    await poll.edit({ embeds: [embed] });

    const collector = interaction.channel.createMessageComponentCollector();

    collector.on('collect', async i => {
      if (i.customId === 'poll_command_button') {
        // 現在の投票IDがこの投票のIDと一致するか確認する
        if (currentPollId !== poll.id) {
          return i.editReply("このボタンは現在の投票に対してのみ有効です。");
        }

        const channelId = interaction.channel.id;
        const messageId = currentPollId;

        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) return i.editReply("チャンネルIDの指定が間違っているか、チャンネルが見つかりません。");

        const message = await channel.messages.fetch(messageId).catch(err => {
          console.error(err);
          return null;
        });
        if (!message) return i.editReply("メッセージIDの指定が間違っているか、メッセージが見つかりません。");
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
            const reaction = reactions.find(r => r.emoji && r.emoji.name === emoji);
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
        
        await i.deferUpdate();
        i.editReply({content:"投票が終了し、結果が送信されました。",components:[],ephemeral: true});
      } else if (i.customId === "copypollcommand") {
        await i.deferUpdate();
      
        const commandInfo = i.client.commands.get('poll').data.toJSON();
      
        // コマンドの名前
        let commandMessage = `/${commandInfo.name}`;
      
        // コマンドのオプション
        commandInfo.options.forEach(option => {
          if (option.required) {
            commandMessage += ` ${option.name}:${interaction.options.getString(option.name)}`;
          } else {
            const value = interaction.options.getString(option.name);
            if (value) {
              commandMessage += ` ${option.name}:${value}`;
            }
          }
        });
      
        i.followUp({ content: `<@!${interaction.user.id}>がこの投票を作成しました\nコマンドをコピー` + '```' + commandMessage + '```', ephemeral: true });
      } else if (i.customId === "poll_delete_button") {
        // メッセージを削除
        await poll.delete();
        await i.deferUpdate();
        i.editReply({ content: "投票を削除しました。", ephemeral: true, components:[] });
      }
    });

    return;
  }
};
