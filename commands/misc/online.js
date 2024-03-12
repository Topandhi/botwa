const { calculatePing } = require("../../utils");
const fs = require('fs').promises; // Note the use of 'fs.promises'
const path = require('path');
async function rewriteJsonToFile(filePath, data) {
    try {
            const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string, formatted for readability
                    await fs.writeFile(filePath, jsonData, 'utf8');
                            console.log('File has been rewritten successfully.');
                                } catch (error) {
                                        console.error('Failed to rewrite the file:', error);
                                                throw error; // Rethrow or handle as needed
                                                    }
                                                    }
async function readAndParseJsonFile(filePath) {
    try {
            const data = await fs.readFile(filePath, { encoding: 'utf8' });
                    return JSON.parse(data);
                        } catch (error) {
                                console.error('Failed to read or parse the file:', error);
                                        throw error; // Rethrow or handle as needed
                                            }
                                            }
module.exports = {
    name: "online",
    category: "misc",
    desc: "Set Online Status",
    async exec({ client, msg, args, isOwner}) {
    if(args[0]==''||args[0]==undefined){
        await msg.reply('Gunakan \n.online [time1] [time2] [dst],\n contoh: .online 0-8 16-24');
        }
        else{
        // Fetch group metadata to get member list
        const groupId = msg.key.remoteJid;
            const groupMetadata = await client.groupMetadata(groupId);
                const _isAdmin = groupMetadata.participants.find(part => part.id === msg.key.participant);
                     
                     const isAdmin = _isAdmin.admin=='admin'||_isAdmin.admin=='superadmin'?true:false;   
                const members = groupMetadata.participants.map(participant => participant.id);
                    const mNumber = String(_isAdmin.id).split('@')[0];
                        // Construct message with mentions
                            let text = "";
                                let mentions = [];
                                
        const mTag = String(args[0]).toLowerCase();
        var pesan = '';
        const filePath = path.join(__dirname, 'role.txt'); // Your file path
        
        var parsedData = await readAndParseJsonFile(filePath);
        
        parsedData.standbyTime[mNumber] = [];
        for(var i=0;i<args.length;i++){
        if(String(args[i]).includes('-')){
        pesan += (args[i] + ' ');
        parsedData.standbyTime[mNumber].push(args[i]);
        }
        }
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Menambahkan Waktu Aktif ${pesan}`);
        }
    }
}
