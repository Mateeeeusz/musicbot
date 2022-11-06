require("dotenv").config()
const fs = require("fs")
const { request } = require('undici');
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const client = new Client({ 
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
      ]
})

const { Player } = require("discord-player");
const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        dlChunkSize: 0
    },
    defaultvolume: 75
});

player.on("trackStart", async(queue, track) => {
    console.log(track)
    const trackfound = new EmbedBuilder()
        .setColor(0x9874d4)
        .setAuthor({ name: "🎶 Odpalam utwór" })
        .setImage(track.thumbnail)
        .addFields(
            { name: '<:emoji2:1038862067454709801> Nazwa:', value: `\`${track.title}\`` },
            { name: '<:e3moji:1038864783635656794> Trwa:', value: `\`${track.duration}\``, inline: true },
            { name: '<:emoji:1038862066053816330> Wyświetleń:', value: `\`${track.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}\``, inline: true },
            { name: '<:e3moji:1038864783635656794> Odnośnik:', value: `[Przekierowanie...](${track.url})`, inline: true },
        )

    const trackrow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("BACK_MUSIC")
                .setEmoji("1038935794397741109")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("PAUSE_MUSIC")
                .setEmoji("1038868577303933008")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("NEXT_MUSIC")
                .setEmoji("1038935744493920326")
                .setStyle(ButtonStyle.Secondary)
        )

    queue.metadata.channel.send({ embeds:[trackfound], components: [trackrow] })
})

client.once("ready", async() => {
    console.log("I'm ready bitch!")
    require("./commandHandler.js").execute(client)
})

client.on("interactionCreate", async(interaction) => {
    if(!interaction.isChatInputCommand) return;
    if(interaction.isChatInputCommand()){
        const command = fs.readFileSync(`./commands/${interaction.commandName}.js`, 'utf8')
        if(command){
            require(`./commands/${interaction.commandName}`).execute(client, interaction, player)
        }
    }
})

client.on("interactionCreate", async(interaction) => {
    if(!interaction.isButton()) return;
    if(interaction.customId == "PAUSE_MUSIC") {
        console.log(interaction.message.components[0].components[1])

        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

        const success = queue.setPaused(true);
        
        if (!success) queue.setPaused(false); 
        
        interaction.message.components[0].components[1]

        await interaction.message.edit({
            embeds: [...interaction.message.embeds],
            components: [new ActionRowBuilder().addComponents(...interaction.message.components[0].components.map(btn => {
              if(btn.data.custom_id == "PAUSE_MUSIC"){
                if(btn.data.emoji.id == "1038868577303933008"){
                  btn.data.emoji.id = "1038935744493920326"
                  return btn
                } else if(btn.data.emoji.id == "1038935744493920326"){
                  btn.data.emoji.id = "1038868577303933008"
                  return btn
                }
              }
              return btn
            }))]
          })
        return interaction.reply({ content: `${success ? `Current music ${queue.current.title} paused ✅` : `Current music ${queue.current.title} resumed ✅`}`, ephemeral: true});
    }
})

client.login(process.env.TOKEN)