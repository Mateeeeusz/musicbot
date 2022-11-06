const { EmbedBuilder } = require('@discordjs/builders');
const { inspect } = require("util");
const { SlashCommandBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Komenda do pomijania muzyki!'),
    execute: async (client, interaction, player) => {
        const queue = player.getQueue(interaction.guildId);

        const tracknotstop = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Nie ma żadnej piosenki którą mógłbym przewinąć.`)

        if (!queue || !queue.playing) return interaction.reply({ embeds: [tracknotstop], ephemeral: true });

        const trackvolumesuccess = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`🎶 Skipnąłeś piosenkę **${queue.current.title}**`)

        const trackvolumedeny = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Coś poszło nie tak.`)

        interaction.reply({ embeds: queue.skip() ? [trackvolumesuccess] : [trackvolumedeny] });
    }
}