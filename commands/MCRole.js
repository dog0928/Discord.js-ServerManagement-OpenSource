const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');
const { RoleChannel, RoleNofication, RoleName } = require('../config.json')
const { Rcon } = require("rcon-client");
const User = require('../user');
require('dotenv').config();

async function getProfileId(username) {
    try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const data = await response.json();
        if (data && data.id) {
            // Mojang APIからのレスポンスにプロフィールIDが含まれている場合
            return data.id;
        } else {
            // ユーザーが見つからない場合
            return null;
        }
    } catch (error) {
        console.error('Error fetching profile ID:', error);
        return null;
    }
}

// テスト用のユーザー名を指定して、プロフィールIDを取得する
const username = 'aaa'; // ここにユーザー名を入力してください
getProfileId(username)
    .then(profileId => {
        if (profileId) {
            console.log(`TESTCoomand Now\nProfile ID: ${profileId}`);
        } else {
            console.log('ユーザーが見つかりませんでした。');
        }
    })
    .catch(err => console.error(err));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcrole')
        .setDescription('Minecraft ロールを付与します')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('edition')
                .setDescription('Minecraft のエディションを選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'Java Edition', value: 'java' },
                    { name: 'Bedrock Edition', value: 'bedrock' }
                )
        )
        .addStringOption(option =>
            option.setName('mcname')
                .setDescription('Minecraft のユーザー名を入力してください')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('read_rules')
                .setDescription('ルールを読みましたか?')
                .setRequired(true)
                .addChoices(
                    { name: 'yes', value: 'yes' },
                    { name: 'no', value: 'no' }
                )
        ),
    async execute(interaction) {
        try {
            const edition = interaction.options.getString('edition');
            const mcName = interaction.options.getString('mcname');
            const readRules = interaction.options.getString('read_rules');

            // interactionオブジェクトからclientを取得
            const client = interaction.client;

            // 取得したclientを使用して別のチャンネルにメッセージを送信
            const otherChannel = client.channels.cache.get(RoleChannel);
            const NoficationChannel = client.channels.cache.get(RoleNofication);

            if(edition === "java"){
                const row = new ActionRowBuilder()
                    .addComponents(
                    new ButtonBuilder()
                            .setCustomId('AllowBtn')
                            .setLabel('許可')
                            .setStyle(3),
                    new ButtonBuilder()
                        .setCustomId('DisableBtn')
                        .setLabel('拒否')
                        .setStyle(4)
                );

                await otherChannel.send({
                    content: `# ロール申請が来ました\n申請元 : <@!${interaction.user.id}>` + '\nユーザーID ```' + interaction.user.id + '```' +
                        `\nエディション: ${edition}\nMinecraft名: ` + '```' + mcName + '```' + `\nルール確認: ${readRules}`,
                    components: [row]
                });
                
                try{
                    const collector = otherChannel.createMessageComponentCollector();

                collector.on('collect', async i => {
                    if (i.customId === 'AllowBtn') {
                        // interactionオブジェクトからclientを取得
                        const member = interaction.guild.members.cache.get(interaction.user.id);
                        
                        // ロールを取得
                        const role = interaction.guild.roles.cache.find(role => role.name === RoleName);

                    if(edition === "java"){
                        // ロールをメンバーに付与
                        try {
                            await member.roles.add(role);
                            async function main() {
                                const rcon = await Rcon.connect({
                                    host: process.env.MC_IP,
                                    port: process.env.MC_PORT,
                                    password: process.env.MC_PASS,
                                    timeout: 5000 // 5秒のタイムアウトを設定
                                });
                            
                                console.log(await rcon.send("list", { timeout: 5000 })); // コマンド送信時のタイムアウトを5秒に設定
                            
                                let responses = await Promise.all([
                                    rcon.send(`whitelist add ${mcName}`, { timeout: 5000 }),
                                ]);
                            
                                for (response of responses) {
                                    console.log(response);
                                }
                            
                                rcon.end();
                            }
                            main().catch(err => {
                                console.error(err);
                            });
                            async function getUUID(username) {
                                try {
                                    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
                                    const data = await response.json();
                                    if (data && data.id) {
                                        // Mojang APIからのレスポンスにUUIDが含まれている場合
                                        return data.id;
                                    } else {
                                        // ユーザーが見つからない場合
                                        return null;
                                    }
                                } catch (error) {
                                    console.error('Error fetching UUID:', error);
                                    return null;
                                }
                            }
                            
                            // テスト用のユーザー名を指定して、UUIDを取得する
                            const username = mcName; // ここにユーザー名を入力してください
                            getUUID(username)
                                .then(uuid => {
                                    if (uuid) {
                                        // データを保存する関数
                                        async function saveUserData(name, userid, mcname, uuid) {
                                            try {
                                                // データを作成し保存
                                                const user = await User.create({ name, userid, mcname, uuid });
                                                console.log('User data saved successfully:', user);
                                            } catch (error) {
                                                console.error('Error saving user data:', error);
                                            }
                                        }

                                        // データを保存
                                        saveUserData(interaction.user.username, interaction.user.id, mcName, uuid);
                                        // ボタンが押された後にレスポンスを延期せずに即座に更新する
                                        // await i.deferUpdate();
                                        i.update({ content: '許可ボタンを押されたのでロールを付与しました\nロール剥奪\n' + '```' + `/takerole name:<@!${interaction.user.id}> role:@クラフター` + '```', components: [] });
                                        NoficationChannel.send(`<@!${interaction.user.id}>さんのロールの申請が許可されました`);
                                    } else {
                                        console.log('ユーザーが見つかりませんでした。');
                                    }
                                })
                                .catch(err => console.error(err));
                        } catch (error) {
                            console.error("ロールを付与できませんでした:", error);
                            await otherChannel.send("ロールを付与できませんでした。エラーが発生しました。");
                        }
                    }}else if (i.customId === 'DisableBtn') {
                        //ボタン作成
                        const Reason = new ActionRowBuilder()
                            .addComponents(
                            new ButtonBuilder()
                                    .setCustomId('Send')
                                    .setLabel('送信')
                                    .setStyle(3),
                            );
                            await i.deferUpdate();
                            await i.editReply({ content: '申請を拒否した理由を送信してください、その後に送信ボタンを教えてください', components: [Reason] });
                    };
                const SendMessage = otherChannel.createMessageComponentCollector();
                //拒否メッセージ
                SendMessage.on('collect', async i => {
                    if (i.customId === 'Send') {
                        //メッセージを取得 
                        const messages = await otherChannel.messages.fetch({ limit: 1 });
                        const previousMessage = messages.last();
                        
                        await i.deferUpdate();
                        await i.editReply({ content: 'メッセージを送信しました\n**送信内容**\n' + `理由: ${previousMessage.content}` });
                
                        await NoficationChannel.send(`<@!${interaction.user.id}>さんの申請は拒否されました。\n理由: ${previousMessage.content}`);
                    }
                });
                });
                
                // 確認メッセージ 
                await interaction.reply({ content: `エディション: ${edition}\nMinecraft名: ` + '```' + mcName + '```' + `\nルール確認: ${readRules}`, ephemeral: true });
                }catch(e){
                    console.log(e)
                }
            }else{
                const row = new ActionRowBuilder()
                    .addComponents(
                    new ButtonBuilder()
                            .setCustomId('AllowBtn')
                            .setLabel('許可')
                            .setStyle(3),
                    new ButtonBuilder()
                        .setCustomId('DisableBtn')
                        .setLabel('拒否')
                        .setStyle(4)
                );
                // ロールの付与などの処理を記述する
                await otherChannel.send({content:`# ロール申請が来ました
                \n申請元 : <@!${interaction.user.id}>` + '\nユーザーID ```' + interaction.user.id + '```' +
                `\nエディション: ${edition}\nMinecraft名: BE_${mcName}\nルール確認: ${readRules}`, components:[row]});

                // 確認メッセージ 
                await interaction.reply({ content: `申請を送りました。\n**確認**\nエディション: ${edition}\nMinecraft名: ` + '```BE_' + mcName + '```' + `\nルール確認: ${readRules}`, ephemeral: true });

                try{
                    const collector = otherChannel.createMessageComponentCollector();

                collector.on('collect', async i => {
                    if (i.customId === 'AllowBtn') {
                        // interactionオブジェクトからclientを取得
                        const member = interaction.guild.members.cache.get(interaction.user.id);
                        
                        // ロールを取得
                        const role = interaction.guild.roles.cache.find(role => role.name === 'クラフター');

                    if(edition === "bedrock"){
                        // ロールをメンバーに付与
                        try {
                            await member.roles.add(role);
                            async function main() {
                                const rcon = await Rcon.connect({
                                    host: process.env.MC_IP,
                                    port: process.env.MC_PORT,
                                    password: process.env.MC_PASS,
                                    timeout: 5000 // 5秒のタイムアウトを設定
                                });
                            
                                console.log(await rcon.send("list", { timeout: 5000 })); // コマンド送信時のタイムアウトを5秒に設定
                            
                                let responses = await Promise.all([
                                    rcon.send(`fwhitelist add ${mcName}`, { timeout: 5000 }),
                                ]);
                            
                                for (response of responses) {
                                    console.log(response);
                                }
                            
                                rcon.end();
                            }
                            main().catch(err => {
                                console.error(err);
                            });
                            await i.deferUpdate();
                            // ボタンが押された後にレスポンスを延期せずに即座に更新する
                            await i.update({ content: '許可ボタンを押されたのでロールを付与しました\nロール剥奪\n' + '```' + `/takerole name:<@!${interaction.user.id}> role:クラフター` + '```', components: [] });
                            await NoficationChannel.send(`<@!${interaction.user.id}>さんのロールの申請が許可されました`);
                        } catch (error) {
                            console.error("ロールを付与できませんでした:", error);
                            await otherChannel.send("ロールを付与できませんでした。エラーが発生しました。");
                        }
                    }
                    }else if (i.customId === 'DisableBtn') {
                        //ボタン作成
                        const Reason = new ActionRowBuilder()
                            .addComponents(
                            new ButtonBuilder()
                                    .setCustomId('Send')
                                    .setLabel('送信')
                                    .setStyle(3),
                            );
                            await i.deferUpdate();
                            await i.editReply({ content: '申請を拒否した理由を送信してください、その後に送信ボタンを教えてください', components: [Reason] });
                    };
                const SendMessage = otherChannel.createMessageComponentCollector();
                //拒否メッセージ
                SendMessage.on('collect', async i => {
                    if (i.customId === 'Send') {
                        //メッセージを取得 
                        const messages = await otherChannel.messages.fetch({ limit: 1 });
                        const previousMessage = messages.last();
                        
                        await i.deferUpdate();
                        await i.editReply({ content: 'メッセージを送信しました\n**送信内容**\n' + `理由: ${previousMessage.content}` });
                
                        await NoficationChannel.send(`<@!${interaction.user.id}>さんの申請は拒否されました。\n理由: ${previousMessage.content}`);
                    }
                });
                });
                
                // 確認メッセージ 
                await interaction.reply({ content: `エディション: ${edition}\nMinecraft名: ` + '```BE_' + mcName + '```' + `\nルール確認: ${readRules}`, ephemeral: true });
                }catch(e){
                    console.log(e)
                }
            }
        }catch(e){
            console.log(e)
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました!', ephemeral: true });
        };
    },   
};