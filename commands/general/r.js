const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function fetchImageWithCurl(url, outputPath) {
    try {
        // Construct the curl command
        const command = `curl -L '${url}' --output '${outputPath}'`;
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
        const command = `curl -Ls '${url}'`;
        const { stdout: content } = await execAsync(command);
        console.log('URL Content:', content);
        return content; // This is the content of the URL
    } catch (error) {
        console.error(`Error fetching URL content: ${error.message}`);
        throw error;
    }
}

// For binary data, like images, this approach may not be ideal because handling binary data through stdout can be tricky. It's better suited for text content like HTML.

module.exports = {
    name: "r",
    aliases: ["r", "rm"],
    category: "general",
    async exec({ client, msg, args, isOwner }) {
        const imageUrl = "https://bgi-team.000webhostapp.com/rooms.jpg"; // Your image URL here
        
        if(args[0]){
         if(args[1]){
             const url = `https://bgi-team.000webhostapp.com/r/${args[0]}.${args[1]}`;
             const mContent = await fetchUrlContent(url);
         }else{

             const url = `https://bgi-team.000webhostapp.com/r/${args[0]}`;
             const mContent = await fetchUrlContent(url);
         }
        }
        
        const outputPath = path.join(__dirname, 'tempImage.jpg'); // Adjust the output path as needed

        try {
            // Download the image using curl
            await fetchImageWithCurl(imageUrl, outputPath);

            // Read the image into a buffer
            const imageBuffer = fs.readFileSync(outputPath);

            // Send the image buffer
            await client.sendMessage(msg.from, {
                image: imageBuffer,
                caption: "Code Rooms",
            });

            // Optionally, delete the image file after sending
            fs.unlinkSync(outputPath);
        } catch (error) {
            // Handle errors
            console.error(`Failed to fetch image: ${error.message}`);
            await client.sendMessage(msg.from, { text: "Sorry, the image could not be loaded." });
        }
    },
};

