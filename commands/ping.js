const Discord = require("discord.js") //discord.js 모듈 불러오기

exports.run = async(client, message, args) => { //핸들링
    let botping = await message.channel.send("계산 중...") //await로 완료되길 기다리면서 메세지 전송

    let pEmbed = new Discord.RichEmbed() //임베드 생성
    .setTitle(`${client.user.username}의 핑:`) //제목 설정
    .addField("💬메세지: ", `${botping.createdTimestamp - message.createdTimestamp}ms`) //필드에 botping의 메세지 생성시간 - 명령어 메세지 생성 시간
    .addField('📡API: ', `${Math.round(client.ping)}ms`) //필드에 WebSocket 핑 추가
    .setFooter(message.author.tag, message.author.avatarURL) //footer에 메세지를 친 유저의 이름#태그 형식으로 쓴 후 아이콘은 해당 유저의 프사로 설정
    .setColor("RANDOM") //랜덤 컬러
    .setTimestamp() //메세지 생성 시간
    botping.edit(pEmbed) //botping를 수정
}

exports.config = { //이게 없으면 오류납니다
    name: "핑", //명령어의 이름을 핑으로 설정
    aliases: ["퐁", "반응속도", "반속"] //단축키 설정
}
