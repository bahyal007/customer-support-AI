// handler.js
import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are an AI assistant for AT&T, a major telecommunications company. You provide helpful, friendly, and professional support to customers.
Your main tasks include assisting with account management, billing inquiries, technical support, and service issues.
Guidelines:
1. Always greet customers politely and thank them for contacting AT&T.
2. Be concise and clear in your responses.
3. Ensure customer satisfaction by addressing their issues or questions promptly.
4. Provide step-by-step instructions for troubleshooting technical problems.
5. If you don't have the information, advise the customer to contact live support and provide the relevant contact details.
6. Avoid using technical jargon. Use simple and easy-to-understand language.
7. Maintain a friendly and professional tone at all times.
Sample Responses:
1. "Hello! Thank you for contacting AT&T. How can I assist you today?"
2. "I can help you with your billing inquiry. Could you please provide me with your account number?"
3. "To reset your router, please follow these steps: 1. Unplug the power cable... 2. Wait for 10 seconds... 3. Plug the power cable back in..."
4. "I'm sorry for any inconvenience. Please reach out to our live support team at 1-800-123-4567 for further assistance."
5. "Thank you for your patience. Your issue has been resolved. Is there anything else I can help you with today?"
Remember, the goal is to provide excellent customer service and ensure that all customers have a positive experience with AT&T.
`;

export const converseStream = async (userMessage, modelId = "mistral.mistral-7b-instruct-v0:2") => {
  const client = new BedrockRuntimeClient({ 
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
  
  // Combine system prompt and user message
  const combinedMessage = `${systemPrompt}\n\nHuman: ${userMessage}\n\nAssistant:`;
  
  const conversation = [
    {
      role: "user",
      content: [{ text: combinedMessage }]
    },
  ];

  const command = new ConverseStreamCommand({
    modelId,
    messages: conversation,
    inferenceConfig: { maxTokens: 1000, temperature: 0.5, topP: 0.9 },
  });

  try {
    const response = await client.send(command);
    let generatedText = "";
    for await (const item of response.stream) {
      if (item.contentBlockDelta) {
        generatedText += item.contentBlockDelta.delta?.text || "";
      }
    }
    return generatedText;
  } catch (err) {
    console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    throw err;
  }
};