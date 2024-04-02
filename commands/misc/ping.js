const { calculatePing } = require("../../utils");
const fs = require('fs').promises;
const path = require('path');

async function readAndParseJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read or parse the file:', error);
        throw error;
    }
}

module.exports = {
    name: "ping",
    category: "misc",
    desc: "Bot Response",
    async exec({ client, msg, args, isOwner }) {
        const groupId = msg.key.remoteJid;
        const groupMetadata = await client.groupMetadata(groupId);
        const senderIsAdmin = groupMetadata.participants.some(part => part.id === msg.key.participant && (part.admin === 'admin' || part.admin === 'superadmin'));
        let text = "";
        let mentions = [];

        if (!args[0] || args[0] === '') {
            await msg.reply(`*${calculatePing(msg.messageTimestamp, Date.now())} _second(s)_*`);
            return;
        }

        const command = args[0].toLowerCase();
        const messageContent = args.slice(1).join(' ');

        if (command === 'all') {
            if (senderIsAdmin) {
                text = messageContent + " ";
                mentions = groupMetadata.participants.map(participant => participant.id);
                for (let member of mentions) {
                    text += ``;
                }
                await client.sendMessage(groupId, { text: text, mentions: mentions });
            } else {
                await msg.reply('Bukan Admin, Tidak Bisa Tag All');
            }
        } else {
            const filePath = path.join(__dirname, 'role.txt');
            const parsedData = await readAndParseJsonFile(filePath);

            if (parsedData.hasOwnProperty(command)) {
                var time = new Date();
                var jam = parseInt(time.getHours())+7;
                for (let memberId of parsedData[command]) {
                    const formattedId = memberId.includes('@s.whatsapp.net') ? memberId : `${memberId}@s.whatsapp.net`;
                    var activeTime = parsedData['standbyTime'][memberId]!=undefined?parsedData['standbyTime'][memberId]:['0-24'];
                   var isAktif = false;
                   for(var t=0;t<activeTime.length;t++){
                   var waktuAktif = String(activeTime[t]).split('-');
                console.log(memberId,waktuAktif);
                if(jam>=waktuAktif[0]&&jam<waktuAktif[1]){
                isAktif = true;
                break;
                }
                
                if(waktuAktif[0]==0&&waktuAktif[1]==0){ 
                isAktif = false;
                }
                }
                if(command=='standby'){isAktif=true;}
                if(isAktif==true){
                    mentions.push(formattedId);
                    text += `@${memberId.split('@')[0]} `;
                    }
                }
                console.log(command,mentions,jam);
                await client.sendMessage(groupId, { text: `${messageContent}`, mentions: mentions });
            } else {
                await msg.reply('Gunakan \n.tag [role] [pesan],\ncontoh:\n.tag en ingfo mabar \n\nrole: all, standby, en, jp, ml, atau mc');
            }
        }
    }
};

