// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// // System prompt for the AI, providing guidelines on how to respond to users
// const systemPrompt = `
// You are an AI assistant for AT&T, a major telecommunications company. You provide helpful, friendly, and professional support to customers.
// Your main tasks include assisting with account management, billing inquiries, technical support, and service issues.

// Guidelines:
// 1. Always greet customers politely and thank them for contacting AT&T.
// 2. Be concise and clear in your responses.
// 3. Ensure customer satisfaction by addressing their issues or questions promptly.
// 4. Provide step-by-step instructions for troubleshooting technical problems.
// 5. If you don't have the information, advise the customer to contact live support and provide the relevant contact details.
// 6. Avoid using technical jargon. Use simple and easy-to-understand language.
// 7. Maintain a friendly and professional tone at all times.

// Sample Responses:
// 1. "Hello! Thank you for contacting AT&T. How can I assist you today?"
// 2. "I can help you with your billing inquiry. Could you please provide me with your account number?"
// 3. "To reset your router, please follow these steps: 1. Unplug the power cable... 2. Wait for 10 seconds... 3. Plug the power cable back in..."
// 4. "I'm sorry for any inconvenience. Please reach out to our live support team at 1-800-123-4567 for further assistance."
// 5. "Thank you for your patience. Your issue has been resolved. Is there anything else I can help you with today?"

// Remember, the goal is to provide excellent customer service and ensure that all customers have a positive experience with AT&T.
// `;

// export async function POST(req) {
//   const openai = new OpenAI();
//   const data = await req.json();

//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: 'system', content: systemPrompt }, ...data],
//       model: 'gpt-4o',  // Ensure the model is correctly named 'gpt-4o'
//       stream: true,
//     });

//     const stream = new ReadableStream({
//       async start(controller) {
//         const encoder = new TextEncoder();
//         try {
//           for await (const chunk of completion) {
//             const content = chunk.choices[0]?.delta?.content;
//             if (content) {
//               const text = encoder.encode(content);
//               controller.enqueue(text);
//             }
//           }
//         } catch (err) {
//           controller.error(err);
//         } finally {
//           controller.close();
//         }
//       },
//     });

//     return new NextResponse(stream);
//   } catch (error) {
//     if (error.code === 'insufficient_quota') {
//       return new NextResponse('You have exceeded your current quota. Please check your plan and billing details.', { status: 429 });
//     } else if (error.code === 'model_not_found') {
//       return new NextResponse('The model "gpt-4o" does not exist or you do not have access to it.', { status: 404 });
//     }
//     return new NextResponse('An error occurred. Please try again later.', { status: 500 });
//   }
// }



// route.js
import { NextResponse } from 'next/server';
import { converseStream } from './handler.js';  

export async function POST(req) {
  const data = await req.json();
  const userMessage = data.prompt;

  try {
    const response = await converseStream(userMessage);
    return NextResponse.json({ text: response }, { status: 200 });
  } catch (error) {
    console.error('Error invoking the model:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}