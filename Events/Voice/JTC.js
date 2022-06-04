const { VoiceState } = require("discord.js");
const { JTCID } = require("./../../Structures/config.json");

module.exports = {
  name: "voiceStateUpdate",
  /**
  * @param {VoiceState} oldState
  * @param {VoiceState} newState
  */
  async execute(oldState, newState, client) {
    const { member, guild } = newState;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const joinToCreate = JTCID
    const ownedChannel = client.voiceGenerator.get(member.id)

    if(oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {
      if(ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
        client.voiceGenerator.set(member.id, null);
        oldChannel.delete().catch(() => {});
      }

      const voiceChannel = await guild.channels.create(`༻✿-${member.displayName}'s bedroom༺`, {
        type: "GUILD_VOICE",
        parent: newChannel.parent,
        permissionOverwrites: [
        //  {id: member.id, allow: ["CONNECT"]},
          {id: guild.id, allow: ["CONNECT"]}
        ]
      });

      client.voiceGenerator.set(member.id, voiceChannel.id);
      await newChannel.permissionOverwrites.edit(member, {CONNECT: false});
      setTimeout(() => newChannel.permissionOverwrites.delete(member), 10 * 1000);
      return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
    }

    //const ownedChannel = client.voiceGenerator.get(member.id)

    //if(ownedChannel && oldChannel.id === ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
    //if(ownedChannel && client.channels.cache.get(ownedChannel).members.size === 0) {
    if(ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
      client.voiceGenerator.set(member.id, null);
      oldChannel.delete().catch(() => {});
    }
  }
}