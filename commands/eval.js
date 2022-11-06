const { EmbedBuilder } = require('@discordjs/builders');
const { inspect } = require("util");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Komenda do testowania funkcji!')
    .addStringOption(option => 
        option.setName('input')
            .setDescription('Wartość input')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (client, interaction) => {
        try {
            let evaled = await eval(interaction.options.getString("input"));

            let output = inspect(evaled).replace(client.token, "[Sekret twojego starego]")
            const embed = new EmbedBuilder()
                .setDescription("Input:\n```js\n" + interaction.options.getString("input") + "```\n\nOutput:\n```js\n" + output + "```")
                .setColor(0x303434)

            console.log(output);
            interaction.reply({ embeds: [embed]})
        }
        catch (error) {
            console.error(error);
            interaction.reply({ content: "Błąd i chuj"});
        }
    }
}