const { Client, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = {
  name: "help",
  description: "Views all commands.",
  /**
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
  async execute(interaction, client) {
    CommandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/Commands/**/*.js`)).map(async (file) => {
        const command = require(file);
    
        if(!command.name)
        return
    
        if(!command.description)
        return
    
        CommandsArray.push(command);
      });

    const Embed = new MessageEmbed()
    .setTitle("Help?")
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setColor('BLUE')
    .setDescription(`Here's all commands for ${interaction.client.user.username}!`)
    CommandsArray.forEach(command => {
        Embed.addField(`${command.name}`, `${command.description}\n${command.permission ? `\`Required: ${command.permission}\`` : ""}`, true)
    })

    interaction.reply({embeds: [Embed], ephemeral: true})
  }
}