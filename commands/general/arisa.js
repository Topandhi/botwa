const clt = require("../../lib/Collection")
const { botName } = require("../../config.json")
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();

const { OpenAI } = require('openai');

const openai = new OpenAI({apiKey:'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'});

let isAuthenticated = false;

async function authenticateIfNeeded() {
    if (!isAuthenticated) {
        await characterAI.authenticateWithToken('02ddb1e7f53d6d0e970ea6b50626dc4302b90a1b');
        isAuthenticated = true;
    }
}
async function getResponse(message) {
  try {
    // Authenticating as a guest (use `.authenticateWithToken()` to use an account)
    // await characterAI.authenticateAsGuest();
    // await characterAI.authenticateWithToken('02ddb1e7f53d6d0e970ea6b50626dc4302b90a1b');
        // Authenticate only if needed
        await authenticateIfNeeded();

    // Place your character's id here
    const characterId = "-LTb1TFFjX5Q0jHBlwu6mHb6sSnOjDMIBzEt245urkE";

    const chat = await characterAI.createOrContinueChat(characterId);

    // Send a message
    const response = await chat.sendAndAwaitResponse(message, true);

    console.log(response);
    // Use `response.text` to use it as a string
    return response.text.trim().replace(/\n+/g, '\n');
  } catch (error) {
    console.error("Error calling CharacterAI:", error);
    return "c.ai disconnect";
  }
}
module.exports = {
    name: "arisa",
        aliases: ["arisa", "arisa"],
            category: "general",
                async exec({ client, msg, args, isOwner}) {
                       var message = '';
                       for (var i=0;i<(args.length);i++){
                       message += `${args[i]}`;
    }                                                                                                                let data = await getResponse(`${message}`);
                                                        		                                                                                                            
                                                        		                                                                                                                            await client.sendMessage(msg.from, { text: data });
      
        }}                                                		                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
