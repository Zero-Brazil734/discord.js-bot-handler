const Discord = require("discord.js")

exports.run = async(client, message, args) => {
    let botping = await message.channel.send("계산 중...")
    let botpingmsg = Date.now() - message.createdAt;

    let pEmbed = new Discord.RichEmbed()
    .setTitle(`${client.user.username}의 핑:`)
    .addField("💬메세지: ", `${botping.createdTimestamp - message.createdTimestamp}ms`)
    .addField('📡API: ', `${Math.round(client.ping)}ms`)
    .setFooter(message.author.tag, message.author.avatarURL)
    .setColor("RANDOM")
    .setTimestamp()
    botping.edit(pEmbed)
}

exports.config = {
    name: "핑,
    aliases: ["퐁", "반응속도", "반속"]
}
