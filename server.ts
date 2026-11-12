import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client (uses process.env.GEMINI_API_KEY if available)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
try {
  ai = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI({});
} catch (e) {
  console.warn('GoogleGenAI initialization warning:', e);
}

const SYSTEM_INSTRUCTION = `You are the friendly, fast, and helpful AI assistant for Kebab Nite, a beloved local takeaway located at 18A High Street, Carrickfergus, Northern Ireland (Phone: 028 9332 1805).

Shop details:
- Opening Hours: Open 7 days a week, 4:00 PM – Late (Delivery from 4:30 PM).
- Location: 18A High Street, Carrickfergus, BT38 7AF.
- Food specialities: Fresh flame-grilled Donner kebabs, Chicken Tikka, House Mixed Kebabs, Munchy Boxes, Fresh Pizzas (Margherita, Meat Feast, Pepperoni, Veggie, Hawaiian, Hot & Spicy), Loaded Burgers (Bacon Double, Quarter Pounder, Veggie Burger), Hot Dogs (Traditional Jumbo, Chilli Dog, Dogzilla Loaded), Chips, Soft Drinks (Pepsi, Diet Pepsi, Coca Cola, Diet Coke, Fanta, 7Up, Ayran Turkish yoghurt drink, Dr Pepper, Water).
- £15 Weekday Deals:
  * Munchy Box Special: 10" pizza box filled with doner meat, chicken tikka, chips, onion rings, garlic bread & 2 sauces.
  * 12" Pizza Deal: Any 12" pizza + portion of chips + 2 cans of soft drink.
  * Kebab Feast Deal: 1 Large Doner or Chicken Kebab on warm naan + chips + 1 can of drink.
  * Burger Night Deal: 2 Quarter Pounder Cheese Burgers + 2 portions of chips + 2 dips.
- Ordering & Payments:
  * Customers can order online through the website with the "Food Cart".
  * Transparent 5% online ordering & platform fee applied at checkout summary.
  * Payment options: 1) Online Payments via Stripe (Card details: Visa, Mastercard, Amex, and Apple Pay) as the primary payment gateway; 2) Cash on Delivery is available as an optional backup payment system if the customer does not have a card.
  * Customers can track their order status anytime on the "My Orders" page using their phone number.
- Brand Tone: Friendly, concise, warm local Northern Irish takeaway spirit, helpful and appetizing. No long-winded essays; keep answers crisp, warm, and clear.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, customerPhone } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const isValidApiKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10;

    if (isValidApiKey && ai) {
      const promptContext = customerPhone
        ? `Customer phone number on record: ${customerPhone}.\nUser asks: ${message}`
        : `User asks: ${message}`;

      // Wrap with a 6-second timeout to guarantee fast response
      const aiCallPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout')), 6000)
      );

      const response = await Promise.race([aiCallPromise, timeoutPromise]);
      const reply = response.text || "I'm here to help with your Kebab Nite order!";
      res.json({ reply });
      return;
    }

    // High quality intelligent response fallback
    const lower = message.toLowerCase();
    let reply = "Welcome to Kebab Nite at 18A High Street, Carrickfergus! We are open daily 4:00 PM till Late.";
    if (lower.includes('deal') || lower.includes('£15') || lower.includes('15')) {
      reply = "🔥 Check out our £15 Deals:\n• Munchy Box Special (Doner, Tikka, Chips, Onion Rings, Garlic Bread, 2 Sauces)\n• 12\" Pizza Deal (Any 12\" Pizza + Chips + 2 Cans)\n• Kebab Feast (Large Doner/Tikka on naan + Chips + Can)\n• Burger Night (2 Quarter Pounder Burgers + 2 Chips + 2 Dips)!";
    } else if (lower.includes('pay') || lower.includes('fee') || lower.includes('card') || lower.includes('cash') || lower.includes('stripe')) {
      reply = "💳 Online payments are processed directly with Stripe (Visa, Mastercard, Amex, Apple Pay). Cash on delivery is also available as an optional backup payment system if you do not have a card with you. A 5% online ordering fee is calculated at checkout summary.";
    } else if (lower.includes('drink') || lower.includes('ayran') || lower.includes('pepsi') || lower.includes('coke')) {
      reply = "🥤 We have all major soft drinks to bulk up your meal: Pepsi, Diet Pepsi, Coca Cola, Diet Coke, Fanta, 7Up, Dr Pepper, and refreshing Turkish Ayran yoghurt drink!";
    } else if (lower.includes('track') || lower.includes('status') || lower.includes('history')) {
      reply = "📦 Enter your phone number in the search bar above or check 'Track My Orders' at the bottom of the page to see live kitchen status!";
    } else if (lower.includes('hour') || lower.includes('time') || lower.includes('open')) {
      reply = "🕒 We are open 7 days a week: Mon–Sun 4:00 PM – Late (Delivery starts 4:30 PM). Find us at 18A High Street, Carrickfergus.";
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error handling chat request:', error);
    res.json({
      reply: "Welcome to Kebab Nite Carrickfergus! You can browse our full menu, add £15 specials to your Food Cart, choose Cash on Delivery or Card, or check your previous orders in 'My Orders' with your phone number."
    });
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kebab Nite server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
