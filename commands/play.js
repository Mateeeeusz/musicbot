const { EmbedBuilder } = require('@discordjs/builders');
const { inspect } = require("util");
const { SlashCommandBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Komenda do puszczania muzyki!')
    .addStringOption(option => 
        option.setName('piosenka')
            .setDescription('Podaj tytuł lub link do piosenki')
            .setRequired(true)),
    execute: async (client, interaction, player) => {
        if (!interaction.member.voice.channelId) return await interaction.reply({ content: "`❌` Nie ma cię na kanale głosowym!", ephemeral: true });
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: "`❌` Nie ma cię na kanale na którym gram!", ephemeral: true });
        const query = interaction.options.getString("piosenka");
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });
        
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "`❌` Nie mogę dołączyć na twój kanał głosowy!", ephemeral: true });
        }

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);

        const tracknotfound = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`❌ Nie mogę znależć **${query}**`)

        if (!track) return await interaction.followUp({ embeds: [tracknotfound]  });

        queue.play(track);

        const trackfound = new EmbedBuilder()
            .setColor(0x9874d4)
            .setDescription(`⏱️ Wczytuję utwór **${track.title}**`)

        return await interaction.followUp({ embeds: [trackfound]  });
    }
}