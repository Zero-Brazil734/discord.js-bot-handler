const Discord = require("discord.js") //Discord.js 모듈 불러오기
const client = new Discord.Client() //클라이언트(봇) 생성
const fs = require("fs") //파일 리더기


client.commands = new Discord.Collection() //클라이언트 내에 commands 컬렉션 생성
client.aliases = new Discord.Collection() //클라이언트 내에 aliases 컬렉션 생성

fs.readdir("./commands/", (err, files) => { //./commands 디렉터리 내의 파일들을 읽기 시작
    if(err) { //오류 시:
        console.error(err) //콘솔에 출력
        return process.exit() //프로세스 종료 **호스팅 중에 문제가 생길만한거는 프로세스를 종료하는게 낮습니다
    }

    let filesFilter = files.filter(f => f.split(".").pop() === "js") //파일 이름을 .을 제거 후 Array화, 후에 pop()으로 마지막 Array 스트링를 추출해 js로 끝나는 파일들만 필터링해서 가져오기
    if(filesFilter.length <= 0) { //파일이 없을시
        console.error("[FileSystem] Not have any file in this directory.") //콘솔에 없다고 출력
        return process.exit() //프로세스 종료
    }

    console.log(`[FileSystem] Loading ${filesFilter.length} files:`) //콘솔에 로딩 중인 파일 총량 출력
    filesFilter.forEach(cmdFile => { //forEach로 모든 파일들을 하나하나 읽기 시작,
        let cmd = require(`./commands/${cmdFile}`) //읽힌 파일을 불러오기
        client.commands.set(cmd.config.name, cmd) //아까 전에 생성한 commands 컬렉션에 파일 내에 설정해둔 명령어의 이름과, 파일 내용 저장
        console.log(`[FileSystem] Done: ${cmdFile} command successfully`) //성공시 출력
        for(let alias of cmd.config.aliases) { //aliases라고 설정된 Array에서 하나하나씩 읽기 시작,
            client.aliases.set(alias, cmd) //아까 전에 생성한 aliases 컬렉션에 파일 내에 설정해둔 명령어의 단축키와, 파일 내용 저장
            console.log(`[FileSystem] Done: ${cmdFile} alias successfully`) //성공시 출력
        }
    }) //다 영어로 해둔건 원래 포르투갈어 였는데 못 읽으시니 번역한거라...
})


client.on("ready", () => { //봇이 온라인 상태로 전환될시(모든 작업 준비를 마쳤을시)
    console.log(`${client.user.username} 봇 온라인`)
    let s = [ //플레이중 목록 설정
        { name: `Users: ${client.users.size}명`, type: "STREAMING", url: "https://www.twitch.tv/<트위치 채널 이름>" },
        { name: `Servers: ${client.guilds.size}`, type: "PLAYING" },
        { name: `Credits:  =크레딧`, type: "LISTENING" },
        { name: `Help:  =도움말`, type: "WATCHING" }
    ]

    /**
     * WATCHING = 보는 중
     * LISTENING = 듣는 중
     * PLAYING = 플레이 중
     * STREAMING = 방송 중 (트위치 채널 이름 필요)
     */


    function st() { //플레이중을 설정하는 function 생성
        let rs = s[Math.floor(Math.random() * s.length)]; //플레이중 설정 목록에서 랜덤으로 하나 추출
        client.user.setPresence({ game: rs }).catch(err => console.error(err)); //해당 플레이중을 현재 플레이 중으로 설정
    }

    st(); 
    setInterval(() => st(), 7500); //7.5초(자스에서는 밀리초를 사용해서 그럽니다.)마다 플레이중 변경
})
