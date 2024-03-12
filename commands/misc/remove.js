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
    name: "remove",
    category: "misc",
    desc: "Remove Role Members",
    async exec({ client, msg, args, isOwner}) {
    if(args[0]==''||args[0]==undefined){
        await msg.reply('Gunakan \n.role [role],\n contoh: .role en\n\nrole: all, en, jp, ml, atau mc');
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
        for(var i=1;i<args.length;i++){
        pesan += (args[i] + ' ');
        }
        if(mTag=='all'){
        
        if(isAdmin){
                                    for (let member of members) {
                                            text += `@${member.split('@')[0]} `;
                                                    mentions.push(member);
                                                        }
        await msg.reply(`${pesan}${text}`);
        }
        else {
        await msg.reply('Bukan Admin, Tidak Bisa Tag All')
        }
        }
        else {const filePath = path.join(__dirname, 'role.txt'); // Your file path
        
        var parsedData = await readAndParseJsonFile(filePath);
        if(mTag=='en'||mTag=='endori'){
        parsedData.en = parsedData.en.filter(element => element !== mNumber); 
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Hapus Role`);
        }
        else if(mTag=='jp'||mTag=='jpdori'){
        parsedData.jp = parsedData.jp.filter(element => element !== mNumber);   
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Hapus Role`);
        }
        else if(mTag=='ml'){
        parsedData.ml = parsedData.ml.filter(element => element !== mNumber); 
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Hapus Role`);
        }
        else if(mTag=='mc'||mTag=='minecraft'){
        parsedData.mc = parsedData.mc.filter(element => element !== mNumber);  
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Hapus Role`);
        }
        else if(mTag=='standby'){
        parsedData.mc = parsedData.standby.filter(element => element !== mNumber);  
        rewriteJsonToFile(filePath, parsedData);
        await msg.reply(`Berhasil Hapus Role`);
        }
        else{
        await msg.reply('Gunakan \n.role [role],\ncontoh:\n.role en\n\nrole: all, en, jp, ml, atau mc');
        }
        }
        }
    }
}
