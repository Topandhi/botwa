const clt = require("../../lib/Collection")
const { botName } = require("../../config.json")

const { OpenAI } = require('openai');

const openai = new OpenAI({apiKey:'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'});

async function getResponse(message) {
    try {
    	const response = await openai.chat.completions.create({
    	    		messages: [{ role: "system", content: message }],
    	    		    		model: "gpt-3.5-turbo",
    	    		    		  	});
    	    		    		  	console.log(response.choices[0].message,'cekd');
    	    		    		  	        return response.choices[0].message.content.trim();
    	    		    		  	            } catch (error) {
    	    		    		  	                    console.error("Error calling OpenAI:", error);
    	    		    		  	                            return "Sorry, I couldn't process that.";
    	    		    		  	                                }
    	    		    		  	                                }
module.exports = {
    name: "ai",
        aliases: ["ai", "ai"],
            category: "general",
                async exec({ client, msg, args, isOwner}) {
                       var message = '';
                       for (var i=0;i<(args.length);i++){
                       message += `${args[i]}`;
    }                                                                                                                let data = await getResponse(`${message}`);
                                                        		                                                                                                            
                                                        		                                                                                                                            await client.sendMessage(msg.from, { text: data });
      
        }}                                                		                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
