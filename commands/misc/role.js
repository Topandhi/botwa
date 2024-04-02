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
    name: "role",
    category: "misc",
    desc: "Role Members",
    async exec({ client, msg, args, isOwner}) {
    if(args[0]==''||args[0]==undefined){
        await msg.reply('Gunakan \n.role [role],\n contoh: .role en\n\nrole: all, standby, en, jp, ml, atau mc');
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
        var isAv = false;
                                    for (let i=0;i<parsedData['en'].length;i++) {
                                    if(mNumber==parsedData['en'][i]){
                                    isAv = true;
                                    break;
                                    }
                                    }
                                    if(isAv==false){
        parsedData.en.push(mNumber);
        rewriteJsonToFile(filePath, parsedData);
        }
        await msg.reply(`Berhasil Menambahkan Role`);
        }
        else if(mTag=='jp'||mTag=='jpdori'){
        var isAv = false;
                                    for (let i=0;i<parsedData['jp'].length;i++) {
                                    if(mNumber==parsedData['jp'][i]){
                                    isAv = true;
                                    break;
                                    }
                                    }
                                    if(isAv==false){
        parsedData.jp.push(mNumber);
        rewriteJsonToFile(filePath, parsedData);
        }
        await msg.reply(`Berhasil Menambahkan Role`);
        }
        else if(mTag=='ml'){
        var isAv = false;
                                    for (let i=0;i<parsedData['ml'].length;i++) {
                                    if(mNumber==parsedData['ml'][i]){
                                    isAv = true;
                                    break;
                                    }
                                    }
                                    if(isAv==false){
        parsedData.ml.push(mNumber);
        rewriteJsonToFile(filePath, parsedData);
        }
        await msg.reply(`Berhasil Menambahkan Role`);
        }
        else if(mTag=='mc'||mTag=='minecraft'){
        var isAv = false;
                                    for (let i=0;i<parsedData['mc'].length;i++) {
                                    if(mNumber==parsedData['mc'][i]){
                                    isAv = true;
                                    break;
                                    }
                                    }
                                    if(isAv==false){
        parsedData.mc.push(mNumber);
        rewriteJsonToFile(filePath, parsedData);
        }
        await msg.reply(`Berhasil Menambahkan Role`);
        }
        else if(mTag=='standby'){
        var isAv = false;
                                    for (let i=0;i<parsedData['standby'].length;i++) {
                                    if(mNumber==parsedData['standby'][i]){
                                    isAv = true;
                                    break;
                                    }
                                    }
                                    if(isAv==false){
        parsedData.standby.push(mNumber);
        rewriteJsonToFile(filePath, parsedData);
        }
        await msg.reply(`Berhasil Menambahkan Role`);
        }
        else{
        await msg.reply('Gunakan \n.role [role],\ncontoh:\n.role en\n\nrole: all, standby, en, jp, ml, atau mc');
        }
        }
        }
    }
}
