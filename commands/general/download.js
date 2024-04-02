const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);
const ytdl = require('ytdl-core');
//const fbdl = require('fbdl-core');
//const instagramDl = require("@sasmeee/igdl");
async function fetchImageWithCurl(url, outputPath) {
    try {
        // Construct the curl command
        const command = `curl -L "${url}" --output "${outputPath}"`;
        // Execute the curl command
        await execAsync(command);
        console.log('Image has been downloaded successfully.');
    } catch (error) {
        console.error(`Error downloading image: ${error.message}`);
        throw error;
    }
}
async function fetchUrlContent(url) {
    try {
        const command = `curl -Ls "${url}"`;
        const { stdout: content } = await execAsync(command);
        console.log('URL Content:', content);
        return content; // This is the content of the URL
    } catch (error) {
        console.error(`Error fetching URL content: ${error.message}`);
        throw error;
    }
}
// Function to check if current time is within given time ranges and not Sunday
function isTimeWithinRangesAndNotSunday() {
    const now = new Date(); // Get the current date and time
        const dayOfWeek = now.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
            const hours = now.getHours(); // Extract the hours
                const minutes = now.getMinutes(); // Extract the minutes
                
                    // If today is Sunday, immediately return false
                        if (dayOfWeek === 0) {
                                return false;
                                    }
                                    
                                        // Convert current time to minutes since start of the day
                                            const currentTimeInMinutes = hours * 60 + minutes;
                                            
                                                // Define time ranges in minutes since start of the day
                                                    const range1Start = 8 * 60 + 30; // 08:30
                                                        const range1End = 11 * 60 + 30; // 11:30
                                                            const range2Start = 13 * 60 + 30; // 13:30
                                                                const range2End = 15 * 60 + 30; // 15:30
                                                                
                                                                    // Check if current time is within the first time range
                                                                        const isInFirstRange = currentTimeInMinutes >= range1Start && currentTimeInMinutes <= range1End;
                                                                            // Check if current time is within the second time range
                                                                                const isInSecondRange = currentTimeInMinutes >= range2Start && currentTimeInMinutes <= range2End;
                                                                                
                                                                                    // Return true if current time is within any of the ranges, else false
                                                                                        return isInFirstRange || isInSecondRange;
                                                                                        }
                                                                                        

// For binary data, like images, this approach may not be ideal because handling binary data through stdout can be tricky. It's better suited for text content like HTML.

module.exports = {
    name: "download",
    desc:"Untuk Download Video Youtube & instagram",
    use:"<yt-link> [quality]\n\nquality = highest, lowest, highestaudio, lowestaudio, highehstvideo, lowestvideo",
    aliases: ["r", "rm"],
    category: "general",
    async exec({ client, msg, args, isOwner }) {
    if(args[0]&&(1==1)){
    const url = args[0];
    var isInsta = String(url).includes('insta');
    var isYt = String(url).includes('youtu');
    var isFb = String(url).includes('face');
    
    if (ytdl.validateURL(url)||isInsta||isFb) {
            var itag = '18';
            if(args[1]){
            itag = args[1];
            }
                let format = false;
                if(isYt){
        const videoId = ytdl.getURLVideoID(url);
            const info = await ytdl.getInfo(videoId);
                format = ytdl.chooseFormat(info.formats, { quality: itag });
                }
                if(isInsta||isFb){format=true;}
                console.log(format);
                if(format){
                const fmt = String(itag).includes('audio')?'mp3':'mp4';
        const outputPath = path.join(__dirname, 'tempVideo'+fmt); // Adjust the output path as needed

        try {
        if(isInsta){
            const dataList = await instagramDl(url);
            console.log(dataList);
            await fetchImageWithCurl(dataList[0].download_link, outputPath);
            }
            else if(isYt){
            // Download the image using curl
            await fetchImageWithCurl(format.url, outputPath);
            }
            else if(isFb){
            console.log(url);
            const dataFb = await fbdl.getInfo(url);
            console.log(dataFb);
            await fetchImageWithCurl(dataFb.rawVideo, outputPath);
            }

            // Read the image into a buffer
            const imageBuffer = fs.readFileSync(outputPath);

            // Send the image buffer
            await client.sendMessage(msg.from, {
                video: imageBuffer,
                caption: "Your Video",
            });

            // Optionally, delete the image file after sending
            fs.unlinkSync(outputPath);
        } catch (error) {
            // Handle errors
            console.error(`Failed to fetch image: ${error.message}`);
            await client.sendMessage(msg.from, { text: "Sorry, the image could not be loaded." });
        }
                }
                   else  if (format&&1==0) {
                            const videoStream = ytdl.downloadFromInfo(info, { quality: format.itag });
                                    const fileName = `video-${videoId}.mp4`;
                                            const videoFile = fs.createWriteStream(fileName);
                                                    videoStream.pipe(videoFile).on('finish', () => {
                                                                // Send the video to the user
                                                                
                                                                videoFile.on('finish', async () => {
                                                                    await sock.sendMessage(msg.from, { video: fs.readFileSync(fileName), caption: "Here's your video!" }, { quoted: msg });
                                                                        // Optionally delete the video file after sending
                                                                            fs.unlinkSync(fileName);
                                                                            });
                                                                            
                                                                                    });
                                                                                       }
                                                                                        } else {
                                                                                            // Inform the user about the invalid URL
                                                                                            		                                                                                                                            await client.sendMessage(msg.from, { text: 'Link Tidak Valid' });
                                                        
                                                                                            }
                                                                                            }
                                                                                            else{
                                                                                            
                               if(isTimeWithinRangesAndNotSunday()==true){                                                             		                                                                                                                            await client.sendMessage(msg.from, { text: 'Link Kosong' });
                               }
                               else {                                                                                                                            await client.sendMessage(msg.from, { text: 'Kuota Gw Bisa Habis Bjir - BGI Bot' });
                               }
                                                                                            }
    },
};

