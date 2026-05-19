import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { type ChatCompletionMessageParam } from 'openai/resources/chat';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event: any) => {
    // Extract the `prompt` from the body of the request
    const { messages } = (await readBody(event)) as {
      messages: ChatCompletionMessageParam[];
    };
    // console.log('recent messages :' , messages[messages.length - 1].content)

    let drawChartFlag = false; 

    if(messages[messages.length - 1].content) {
      let msg = messages[messages.length - 1].content;
      if (msg !== null && msg !== undefined) {
        const msgstr = msg.toString();
        const msgstrArray = msgstr.split(' ');
        if(msgstrArray.includes('chart') || msgstrArray.includes('차트') || msgstrArray.includes('json')) {
          drawChartFlag = true;
        }
      }
    }

    if(drawChartFlag) {
      const response = await openai.chat.completions.create({
        //model: 'gpt-3.5-turbo-1106',
        //model: 'gpt-4-1106-preview',
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          {
            role: 'user',
            content: `Given the following post content, make new proper json array of data. 
            a JSON data looks like 
              { x: 'yyyy-mm' , y: 10}
           or an empty [] if there an error occur.
             Only respond with an array. Do Not contain any other text or example data. Only Responsd with JSON Array. Post content: ${messages[messages.length - 1].content} `
          }
        ],
      });
      console.log( "response content : " ,response.choices[0].message.content);
      
      return "chart_data "+response.choices[0].message.content;

    } else {
      // Ask OpenAI for a streaming chat completion given the prompt
      const response = await openai.chat.completions.create({
        //model: 'gpt-3.5-turbo-1106',
        //model: 'gpt-4-1106-preview',
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        stream: true,
        messages,
        
      });
      // console.log("response : \n" ,  response);


      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);

      // Respond with the stream
      return new StreamingTextResponse(stream);
    }

    
  });
});