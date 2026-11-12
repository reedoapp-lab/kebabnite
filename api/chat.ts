import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
try {
  ai = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI({});
} catch (e) {
  console.warn('GoogleGenAI initialization warning:', e);
}

const SYSTEM_INSTRUCTION = `You are the friendly, fast, and helpful AI assistant for Kebab Nite, a beloved local takeaway located at 18A High Street, Carrickfergus, Northern Ireland (Phone: 028 9332 1805).
- Opening Hours: Open 7 days a week, 4:00 PM – Late (Delivery from 4:30 PM).
- Location: 18A High Street, Carrickfergus, BT38 7AF.
- Food specialities: Fresh flame-grilled Donner kebabs, Chicken Tikka, House Mixed Kebabs, Munchy Boxes, Fresh Pizzas, Loaded Burgers, Hot Dogs, Chips, and Soft Drinks (Pepsi, Coca Cola, Ayran, etc.).
- £15 Weekday Deals: Munchy Box Special, 12" Pizza Deal, Kebab Feast Deal, Burger Night Deal.
- Ordering & Payments: Online via Food Cart. 5% platform & online ordering fee shown transparently at checkout summary. Payments: Online Card details & Apple Pay via Stripe are primary; Cash on Delivery/Collection is available as an optional backup payment system.
- Order Tracking: Customers can track order history and status on the 'My Orders' page with their phone number.
- Brand Tone: Friendly, concise, warm local Northern Irish takeaway spirit. Keep answers crisp and helpful.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, customerPhone } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      res.status(200).json({
        reply: "Welcome to Kebab Nite Carrickfergus! Our kitchen is fired up. You can browse our full menu, add £15 specials to your Food Cart, choose Cash on Delivery or Card, or check your previous orders in the 'My Orders' section at the bottom."
      });
      return;
    }

    const promptContext = customerPhone
      ? `Customer phone number on record: ${customerPhone}.\nUser asks: ${message}`
      : `User asks: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.status(200).json({
      reply: response.text || "I'm here to help with your Kebab Nite order, menu specials, and tracking!"
    });
  } catch (error: any) {
    console.error('API Chat error:', error);
    res.status(200).json({
      reply: "Welcome to Kebab Nite Carrickfergus! You can browse our full menu, add dishes to your Food Cart, choose Cash or Card on Delivery, or check your order status with your phone number."
    });
  }
}
