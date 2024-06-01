const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

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
        const { stdout: content } = await execAsync(command, { maxBuffer: 1024 * 1024 * 5 }); // Increased buffer to 5MB
        // console.log('URL Content:', content);
        return content; // This is the content of the URL
    } catch (error) {
        console.error(`Error fetching URL content: ${error.message}`);
        throw error;
    }
}

// For binary data, like images, this approach may not be ideal because handling binary data through stdout can be tricky. It's better suited for text content like HTML.

module.exports = {
    name: "top",
    aliases: ["t", "tp"],
    category: "general",
    async exec({ client, msg, args, isOwner }) {
        const imageUrl = "https://bgi-team.000webhostapp.com/rooms.jpg"; // Your image URL here
        let url = `https://bestdori.com/api/eventtop/data?server=1&event=231&mid=0&interval=0`;
        let isLow = false;
        let isErr = false;
        if(args[0]!=undefined&&args[0]!=null&&args[0]!=''){
            if(parseInt(args[0])>10){
                if(
                    args[0]=='50' ||
                    args[0]=='100' ||
                    args[0]=='300' ||
                    args[0]=='500' ||
                    args[0]=='1000' ||
                    args[0]=='2000' ||
                    args[0]=='2500'
                    )
                    {
                isLow = true;
                url = 'https://bestdori.com/api/tracker/data?server=1&event=231&tier='+args[0];
                }
                else{
                    isLow = true;
                    isErr = true;
                }
            }
        }
        if(isErr==false){
        const mContent = await fetchUrlContent(url);
        let dContent = JSON.parse(mContent);

        if(isLow==false){
        // First, sort the points array by value in ascending order.
        dContent.points.sort((a, b) => a.value - b.value);
        
        // Create a map for quick lookup of users by uid.
        const usersMap = dContent.users.reduce((acc, user) => {
            acc[user.uid] = user;
            return acc;
        }, {});
        
        // Merge user data into points based on uid.
        dContent.points = dContent.points.map(point => {
            const userData = usersMap[point.uid];
            // Only merge if the user data exists to prevent errors.
            if (userData) {
                // Spread operator (...) is used to merge point and userData objects.
                // You might want to customize the merged object structure as needed.
                return {
                    ...point,
                    userName: userData.name,
                    userIntroduction: userData.introduction,
                    userRank: userData.rank,
                    userSid: userData.sid,
                    userStrained: userData.strained,
                    userDegrees: userData.degrees
                };
            }
            return point; // Return the original point if no user data is found (just in case).
        });
        
        // Remove the 'users' property from the data object.
        delete dContent.users;
        // Sort points by `uid` and then by `time` in descending order.
        dContent.points.sort((a, b) => {
            if (a.uid === b.uid) {
                return b.time - a.time; // For the same uid, sort by time descending.
            }
            return a.uid - b.uid; // Otherwise, sort by uid ascending.
        });
        
        // Filter out points to keep only the latest one for each `uid`.
        const latestPoints = dContent.points.filter((point, index, self) => {
            // Keep a point if it's the first occurrence of its `uid` in the sorted list.
            return index === 0 || point.uid !== self[index - 1].uid;
        });
        
        // Update the dContent.points with the filtered results.
        dContent.points = latestPoints;
        dContent.points.sort((a, b) => a.value - b.value);
// Assume this is your original date
const originalDate = new Date();

// Convert 7 hours to milliseconds (7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
const sevenHoursInMilliseconds = 7 * 60 * 60 * 1000;

// Create a new Date object representing 7 hours ahead of the original date's UTC time
const datePlusSevenHours = new Date(originalDate.getTime() + sevenHoursInMilliseconds);

// Convert to a UTC string
const utcStringPlusSevenHours = datePlusSevenHours.toUTCString().replace('GMT','WIB');

        let message = `Time:  ${utcStringPlusSevenHours}
Event: Bloom in the Wilds, O Flowery Maidens
      
#   Points      Level       ID      Player`;
var no = 0;
console.log(dContent,'ceks')
        for (let i = dContent['points'].length-1; i >= 0; i--) {
            no++;
            if(no<=10){
            message += `
${no}       ${dContent['points'][i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}      ${dContent['points'][i].userRank}       ${dContent['points'][i].uid}        ${dContent['points'][i].userName}`;
}
else{
    break;
}
            
        }
        await client.sendMessage(msg.from, { text: message });
    }
    else{
let date = new Date(dContent['cutoffs'][dContent['cutoffs'].length-1].time+(7 * 60 * 60 * 1000));

let message = `Cuttof Terakhir Untuk Top ${args[0]}
${dContent['cutoffs'][dContent['cutoffs'].length-1].ep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}

Updated
${date.toUTCString().replace('GMT','WIB')}
`
        // message = dContent['cutoffs'][dContent['cutoffs'].length-1].ep;
        await client.sendMessage(msg.from, { text: message });
    }
}
else{
    await client.sendMessage(msg.from, { text: `Gunakan .top {number} , number = 10,100,300,500,1000,2000,2500
contoh: .top 10 / .top 100` }); 
}
    },
};

