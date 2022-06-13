const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "kick",
    description: "Kicks a user from the server.",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "target",
            description: "Select a target to kick.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason for the kick.",
            type: "STRING",
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Target = options.getMember("target");
        let Reason = options.getString("reason");

        const Response = new MessageEmbed()
        .setColor("RED")

        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            Response.setDescription(`You do not have permission to kick members.`)
            return interaction.reply({embeds: [Response], ephemeral: true})
        }

        if (!Target) {
            Response.setDescription(`Please provide a target to kick.`)
            return interaction.reply({embeds: [Response], ephemeral: true})
        }

        if (!Reason) {
            Reason = "No reason provided."
        }

        if (Target.id === interaction.member.user.id) {
            Response.setDescription(`You cannot kick yourself.`)
            return interaction.reply({embeds: [Response], ephemeral: true})
        }

        if (Target.id === client.user.id) {
            Response.setDescription(`You cannot kick the bot.`)
            return interaction.reply({embeds: [Response], ephemeral: true})
        }

        await Target.kick(Reason).then(() => {
            Response.setDescription(`🔨 **Kicked** ${Target} from the server.\n\n**Reason**: ${Reason}\n**Moderator**: ${interaction.member}`);
            interaction.reply({embeds: [Response]});
        })
    }
}