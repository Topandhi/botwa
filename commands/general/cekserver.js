const { exec } = require('child_process');
const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);
const sharp = require('sharp');
const { statusBedrock } = require('minecraft-server-util');

module.exports = {
    name: "cekserver",
    aliases: ["cekserver", "cekserver"],
    category: "general",
    async exec({ client, msg, args, isOwner }) {
        const serverHost = '147.185.221.16'; // Replace with your server IP
        const serverPort = 35325; // Default Bedrock Edition port
      let msgx = '';
        try {
            const response = await statusBedrock(serverHost, serverPort);
		console.log('cek response',response);
            const serverInfo = `BGI World\nVersi: ${response.version.name}\nPlayer Online: ${response.players.online}/${response.players.max}
            `;
        msgx = serverInfo;
        const outputPath = path.join(__dirname, 'player.png'); // Adjust the output path as needed
        const croppedOutputPath = path.join(__dirname, 'croppedPlayer.png'); // Path for the cropped image
        const pythonScriptPath = `C:/Users/Administrator/Documents/AutoClick/7.SS_MC/player.py`; // Path to your Python script
        const pythonScriptPath2 = `C:/Users/Administrator/Documents/AutoClick/7.SS_MC/playerclose.py`; // Path to your Python script

        // Define the coordinates for cropping
        const left_top_x = 5;
        const left_top_y = 880;
        const right_top_x = 643;
        const right_top_y = 880;
        const left_bottom_x = 5;
        const left_bottom_y = 895;
        const right_bottom_x = 643;
        const right_bottom_y = 895;

        // Calculate the width and height for the crop area
        const cropWidth = right_top_x - left_top_x;
        const cropHeight = left_bottom_y - left_top_y;
// Run the Python script
            await new Promise((resolve, reject) => {
                exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Python script error: ${error.message}`);
                        reject(error);
                    } else {
                        console.log(`Python script output: ${stdout}`);
                        resolve(stdout);
                    }
                });
            });
            console.log('1');

            // Take a screenshot of the desktop
            await screenshot({ filename: outputPath });

            // Crop and resize the screenshot
            await sharp(outputPath)
                .extract({ left: left_top_x, top: left_top_y, width: cropWidth, height: cropHeight })
                .resize({ width: Math.floor(cropWidth * 0.8), height: Math.floor(cropHeight * 0.8) })
                .toFile(croppedOutputPath);

            console.log('2');
            
            // Read the cropped screenshot into a buffer
            const screenshotBuffer = fs.readFileSync(croppedOutputPath);

            // Send the screenshot buffer
            await client.sendMessage(msg.from, {
                image: screenshotBuffer,
                caption: `${serverInfo}`,
            });

            // Optionally, delete the screenshot files after sending
            fs.unlinkSync(outputPath);	

            await new Promise((resolve, reject) => {
                exec(`python "${pythonScriptPath2}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Python script error: ${error.message}`);
                        reject(error);
                    } else {
                        console.log(`Python script output: ${stdout}`);
                        resolve(stdout);
                    }
                });
            });			

            // await client.sendMessage(msg.from, { text: serverInfo });
        } catch (error) {
            console.error('Error querying server:', error); // Log the actual error
            await client.sendMessage(msg.from, { text: msgx!=''?msgx:'Tidak Dapat Terhubung Ke Server' });
        }
    },
};
