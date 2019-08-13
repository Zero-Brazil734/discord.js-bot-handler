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


client.on("message", async message => {
    if(message.system) return //해당 메세지가 시스템(유저가 들어올때 시스템 메세지 뜨는거요) 메세지일시 평상시로 돌아감(리턴)
    if(message.author.bot) return //해당 메세지를 쓴 유저가 봇일시 리턴
    if(!message.content.startsWith(process.env.PREFIX)) return //메세지가 설정한 접두사로 시작하지 않을시 리턴
    if(message.channel.type === "dm") return //메세지를 쓴 채널이 디엠일시 리턴

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g) //메세지에서 접두사의 글자수 만큼 시작 부분 제거 후, 공백 제거, split로 메세지를 Array화
    const command = args.shift().toLowerCase() //그렇게 만들어진 Array에서 첫부분을 shift()로 추출하고(shift()는 pop()와 반대로 제일 처음을 가져옵니다)) 그 추출한 메세지를 소문자화

    if(client.commands.get(command)) { //만약 아까 전에 생성한 commands 컬렉션에 해당 command가 존재할시:
        client.commands.get(command).run(client, message, args) //해당 컬렉션 명령어 파일에 client, message, args를 전달 후 실행 
    }

    if(client.aliases.get(command)) { //만약 아까 전에 생성한 aliases 컬렉션에 해당 alias가 존재할시:
        client.aliases.get(command).run(client, message, args) //해당 컬렉션 명령어 파일에 client, message, args를 전달 후 실행 
    }
})
client.login(process.env.TOKEN) //봇 로그인
