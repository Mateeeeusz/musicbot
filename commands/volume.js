const { EmbedBuilder } = require('@discordjs/builders');
const { inspect } = require("util");
const { SlashCommandBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Komenda do zmieniania głośności muzyki!')
    .addNumberOption(option => 
        option.setName('liczba')
            .setDescription('Podaj liczbę od 1 do 100')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)),
    execute: async (client, interaction, player) => {
        const queue = player.getQueue(interaction.guildId);

        const tracknotstop = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Nie ma żadnej piosenki którą mógłbym zatrzymać.`)

        if (!queue || !queue.playing) return interaction.reply({ embeds: [tracknotstop], ephemeral: true });

        const volume = interaction.options.getNumber("liczba")

        const trackvolumealready = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Nie możesz zmienić głośności na taką samą jaka jest obecnie.`)

        if(queue.volume == volume) return interaction.reply({ embeds: [trackvolumealready], ephemeral: true })

        ;

        const trackvolumesuccess = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`<:emoji:1038895124995907655> Zmieniłeś głośność na **${volume}/100**`)

        const trackvolumedeny = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Coś poszło nie tak.`)

        interaction.reply({ embeds: queue.setVolume(volume) ? [trackvolumesuccess] : [trackvolumedeny] });
    }
}