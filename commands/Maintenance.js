const { SlashCommandBuilder } = require('discord.js');
const { Maintenance_Channel, Nofication_RoleId } = require('../config.json');
const { Rcon } = require("rcon-client");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Maintenanceモードのオンオフ切り替え')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('maintenance')
                .setDescription('Minecraft のエディションを選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'ON', value: 'on' },
                    { name: 'OFF', value: 'off' }
                )
        ),
    async execute(interaction) {
        try {
            // interactionオブジェクトからclientを取得
            const client = interaction.client;

            const Maintenance = interaction.options.getString('maintenance');
            const otherChannel = client.channels.cache.get(Maintenance_Channel);
            if (Maintenance === "on") {
                async function main() {
                    const rcon = await Rcon.connect({
                        host: process.env.MC_IP,
                        port: process.env.MC_PORT,
                        password: process.env.MC_PASS,
                        timeout: 5000 // 5秒のタイムアウトを設定
                    });

                    console.log(await rcon.send("list", { timeout: 5000 })); // コマンド送信時のタイムアウトを5秒に設定

                    let responses = await Promise.all([
                        rcon.send("maintenance on", { timeout: 5000 }), // ヘルプコマンドのタイムアウトを5秒に設定
                    ]);

                    for (response of responses) {
                        console.log(response);
                    }

                    rcon.end();
                }

                main().catch(err => {
                    console.error(err);
                });
                interaction.reply({content:"Maintenanceモードをオンにしました", ephemeral: true })
                otherChannel.send(`<@&${Nofication_RoleId}>\nMaintenanceモードがオンになりました`);
            } else {
                async function main() {
                    const rcon = await Rcon.connect({
                        host: process.env.MC_IP,
                        port: process.env.MC_PORT,
                        password: process.env.MC_PASS,
                        timeout: 5000 // 5秒のタイムアウトを設定
                    });

                    console.log(await rcon.send("list", { timeout: 5000 })); // コマンド送信時のタイムアウトを5秒に設定

                    let responses = await Promise.all([
                        rcon.send("maintenance off", { timeout: 5000 }), // ヘルプコマンドのタイムアウトを5秒に設定
                    ]);

                    for (response of responses) {
                        console.log(response);
                    }

                    rcon.end();
                }

                main().catch(err => {
                    console.error(err);
                });
                interaction.reply({content:"Maintenanceモードをオフにしました", ephemeral: true })
                otherChannel.send(`<@&${Nofication_RoleId}>\nMaintenanceモードがオフになりました`);
            }
        } catch (e) {
            console.log(e);
        }
    }
}
