const { Client, GatewayIntentBits, Collection,Partials,EmbedBuilder, ActionRowBuilder, ButtonBuilder,
    ModalBuilder, TextInputBuilder, TextInputStyle, Events, ApplicationCommandType, ContextMenuCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
NODE_OPTIONS='--trace-warnings=warn';

const guildId = process.env.guildId;
const token = process.env.token;
const { AdminChannelId, reportchid, errorch } = require("./config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

client.commands = new Collection();

// コマンドハンドラー
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// コマンドを確認する関数を定義
function listCommands() {
    console.log('登録されたコマンド:');
    client.commands.forEach(command => {
        console.log(`${command.data.name} - ${command.data.description}`);
    });
}

// コマンドの登録を行う関数
async function registerCommands() {
    try {
        const guild = await client.guilds.fetch(guildId);
        await guild.commands.set(client.commands.map(command => command.data));
        console.log('Commands registered successfully!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

client.once('ready', () => {
    listCommands(); // コマンドを確認
    registerCommands(); // コマンドを登録

    const rest = new REST({ version: '10' }).setToken(token);
    rest.put(
        Routes.applicationCommands(client.user.id),
        {
            body: [
                new ContextMenuCommandBuilder()
                    .setName("メッセージを報告")
                    .setType(ApplicationCommandType.Message)
            ]
        }
    );

    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.replied) return;

    if (interaction.commandName === 'メッセージを報告') {
        const messageId = interaction.targetMessage.id;
        const channelId = interaction.channel.id;

        const modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('報告')
        const titlemodal = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('報告した理由')
            .setStyle(TextInputStyle.Paragraph)
        const channelmodal = new TextInputBuilder()
            .setCustomId('chanel')
            .setLabel('チャンネルID(無視してOK)')
            .setValue(channelId)
            .setStyle(TextInputStyle.Short);
        const suremodal = new TextInputBuilder()
            .setCustomId('sure')
            .setLabel('メッセージID(無視してOK)')
            .setValue(messageId)
            .setStyle(TextInputStyle.Short);
        const modaltitle = new ActionRowBuilder().addComponents(titlemodal);
        const modalchannel = new ActionRowBuilder().addComponents(channelmodal);
        const modalmessage = new ActionRowBuilder().addComponents(suremodal);
        modal.addComponents(modaltitle, modalchannel, modalmessage);

        await interaction.showModal(modal);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        if (!interaction.isModalSubmit()) return;
        await interaction.reply({ content: "報告を作成中...", ephemeral: true })

        const reportch = interaction.guild.channels.cache.find((channel) => channel.id === reportchid);
        const titleText = interaction.fields.getTextInputValue('title');
        const channelId = interaction.fields.getTextInputValue('chanel');
        const messageId = interaction.fields.getTextInputValue('sure');
        const messagesChannel = client.channels.cache.get(channelId); // チャンネルを取得
        if (!messagesChannel) {
            console.log('指定されたチャンネルが見つかりません。');
            return;
        }

        const message = await messagesChannel.messages.fetch(messageId); // メッセージを取得

        // 画像が添付されている場合、送信内容を空欄にする
        let content = message.content;
        const imgfileOption = message.attachments.first();
        const imgfile = imgfileOption ? imgfileOption.url : null;

        if (!content){
            content = "**メッセージがありません**"
        }

        const notificationEmbed = new EmbedBuilder()
            .setColor("ff0000")
            .setTitle("報告")
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${channelId}/${messageId}`)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(titleText + '\nUserID\n```' + interaction.user.id + '```')
            .addFields(
                { name: '送信者', value: "<@!" + message.author.id + ">" },
                { name: '送信内容', value: content }
            )
            .setImage(imgfile)
            .setTimestamp()
            .setFooter({ text: `N!BOT`, iconURL: client.user.displayAvatarURL() });

        await reportch.send({ embeds: [notificationEmbed] });
        await interaction.editReply({ content: "報告完了", ephemeral: true })
    } catch (e) {
        console.log(e)
    }
});



// コマンドの再読み込み後もコマンドを確認
client.reloadCommands = () => {
    client.commands.clear();
    const reloadedFiles = [];

    for (const file of commandFiles) {
      delete require.cache[require.resolve(`./commands/${file}`)];
      try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        reloadedFiles.push(file); // この行を追加
      } catch (error) {
        console.error(`Error reloading command ${file}:`, error);
      }
    }

    console.log('Reloaded commands:', reloadedFiles);
    listCommands(); // コマンドを確認
};

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const otherChannel = client.channels.cache.get(errorch);
        await otherChannel.send("DiscordBotのエラーが起きました\n致命的な場合、1~5秒ほどBotが落ちます\n```" + error + "```")
        await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 1) {

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('AllowBtn')
                .setLabel('はい')
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId('DisableBtn')
                .setLabel('いいえ')
                .setStyle(4)
        );

    // 1行目には確認メッセージ、2行目以降にはお問い合わせ内容
    const confirmationMessage = "以下の内容をお問い合わせとして送信します。\n" + message.content;

    await message.reply({ content: confirmationMessage, components: [row] });
    } else {return;}
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'AllowBtn' & interaction.channel.type === 1) {
            if (interaction.author && interaction.author.bot) {
                // bot である場合は無視する
                return;
            }

            // メッセージの内容を取得
            const originalContent = interaction.message.content;
            const lines = originalContent.split('\n'); // 改行で分割
            const fromSecondLine = lines.slice(1).join('\n'); 

            // 送信先のチャンネルを取得
            const guild = client.guilds.cache.get(guildId);
            const channel = guild.channels.cache.get(AdminChannelId);

            // メッセージを送信
            const messageEmbed = new EmbedBuilder()
                .setColor("00bfff")
                .setTitle(`お問い合わせ`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL()
                })
                .setDescription(fromSecondLine) // 2行目以降の内容を設定
                .addFields(
                    { name: 'UserID', value: "```" + interaction.user.id + "```" }
                )
                .setTimestamp()
                .setFooter({ text: `N!BOT`, iconURL: client.user.displayAvatarURL() });
            channel.send({ embeds: [messageEmbed] });

            // 送信確認をDMで返す
            await interaction.reply({ content: `あなたのメッセージをサーバーに送信しました\n送信内容\n${fromSecondLine}`, components: [] });
        } else if (interaction.customId === 'DisableBtn') {
            await interaction.reply({ content: 'メッセージの送信をしませんでした。', components: [] });
        }
        
    }
});

client.login(token);

fs.watch('./commands', (event, filename) => {
    console.log(`ファイルの変更を検知しました\nファイル名 : ${filename}\nnow loading.`);

    // 変更されたファイルが JavaScript ファイルであることを確認
    if (filename.endsWith('.js')) {
        // 変更された場合はコマンドリストをクリアして再読み込み
        client.commands.clear();
        // 更新されたコマンドファイルリストを取得
        const updatedCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        // 新しいファイルリストでコマンドを再登録
        for (const file of updatedCommandFiles) {
            delete require.cache[require.resolve(`./commands/${file}`)];
            try {
                const command = require(`./commands/${file}`);
                client.commands.set(command.data.name, command);
            } catch (error) {
                console.error(`Error reloading command ${file}:`, error);
            }
        }
        console.log(`finish load.`);
        listCommands(); // コマンドを確認
    }
});
