const { EmbedBuilder } = require('@discordjs/builders');
const { inspect } = require("util");
const { SlashCommandBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Komenda do zatrzymania muzyki!'),
    execute: async (client, interaction, player) => {
        const queue = player.getQueue(interaction.guildId);

        const tracknotstop = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Nie ma żadnej piosenki którą mógłbym zatrzymać.`)

        if (!queue || !queue.playing) return interaction.reply({ embeds: [tracknotstop], ephemeral: true });

        queue.destroy();

        const trackstop = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`<:emoji:1038868577303933008> Zatrzymałeś piosenkę.`)

        interaction.reply({ embeds: [trackstop]});
    }
}