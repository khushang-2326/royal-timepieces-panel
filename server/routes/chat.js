import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js';

dotenv.config();

const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

const getSystemPrompt = (productsList) => `
You are the AI Concierge and Manager for "Royal Timepieces", a premium luxury watch store.
Your role is to assist customers with professionalism, elegance, and deep knowledge of horology.

**Current Inventory**:
We currently have the following watches in stock:
${productsList}

Key traits:
1. **Tone**: Sophisticated, polite, helpful, and concise.
2. **Knowledge**: You are an expert on brands like Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Richard Mille, etc.
3. **Context**: 
   - We offer complimentary insured shipping worldwide (3-5 business days).
   - We have a 30-day return policy.
   - All watches come with a 5-year international warranty.
   - We accept secure online payments and Cash on Delivery (COD).

Instructions:
- Answer user questions about watches, history, styling, or our store policies.
- USE THE INVENTORY LIST provided above to answer questions about OUR stock and prices.
- **External Products**: If a user asks about a watch we don't carry (e.g., "Apple Watch Series 11", "Samsung Galaxy Watch"), you **SHOULD** answer their question using your general knowledge (e.g., current estimated price, features).
- **Pivot**: After answering about an external product, politely mention that while smartwatches are functional, a Royal Timepiece is a timeless investment.
- Keep responses under 3-4 sentences unless a detailed explanation is requested.
`;

// --- Local Fallback Logic (Enhanced with Inventory) ---
const generateLocalResponse = (input, products) => {
    const lowerInput = input.toLowerCase();

    // 1. Check for Brand/Product Queries in Inventory
    const foundProducts = products.filter(p =>
        lowerInput.includes(p.brand.toLowerCase()) ||
        lowerInput.includes(p.name.toLowerCase())
    );

    if (foundProducts.length > 0) {
        // If specific brand/watch asked
        if (foundProducts.length === 1) {
            return `Yes, we have the ${foundProducts[0].name} available for ${foundProducts[0].price}. It is a magnificent choice.`;
        }
        // If multiple found (e.g. "Rolex")
        const brands = [...new Set(foundProducts.map(p => p.brand))];
        if (brands.length === 1) {
            const examples = foundProducts.slice(0, 3).map(p => p.name).join(", ");
            return `We are proud to offer a fine selection of ${brands[0]} timepieces. Some highlights include: ${examples}.`;
        }
        return `We have ${foundProducts.length} timepieces matching your inquiry, including the ${foundProducts[0].name}. Please visit our Collections page to view them all.`;
    }

    // 2. Greetings
    if (lowerInput.match(/\b(hi|hello|hey|greetings|good morning|good evening)\b/)) {
        return "Greetings. I am the Royal Timepieces AI Manager. How may I assist you with your horological needs today?";
    }

    // 3. Policies
    if (lowerInput.includes("shipping") || lowerInput.includes("delivery") || lowerInput.includes("ship")) {
        return "We provide complimentary insured shipping worldwide. Your timepiece will arrive securely within 3-5 business days.";
    }
    if (lowerInput.includes("return") || lowerInput.includes("refund") || lowerInput.includes("exchange")) {
        return "We offer a 30-day return policy for any unworn timepieces in their original packaging. We strive for your absolute satisfaction.";
    }
    if (lowerInput.includes("warranty") || lowerInput.includes("guarantee")) {
        return "Every Royal Timepiece is backed by our comprehensive 5-year international warranty, covering all movement and manufacturing defects.";
    }
    if (lowerInput.includes("payment") || lowerInput.includes("pay") || lowerInput.includes("cod")) {
        return "We accept all major credit cards and secure online payments. For your convenience, we also offer Cash on Delivery (COD) services.";
    }

    // 4. General / Fallback
    if (lowerInput.includes("price") || lowerInput.includes("cost")) {
        return "Our collection caters to various investment levels. Please specify a model or brand you are interested in.";
    }
    if (lowerInput.includes("thank")) {
        return "You are most welcome. It is my pleasure to assist you.";
    }
    if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
        return "Goodbye. We look forward to serving you again at Royal Timepieces.";
    }

    return "That is an interesting inquiry. While I specialize in our luxury timepieces and services, I would recommend browsing our Collections page or contacting our concierge for specific details.";
};

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        // Fetch live products from DB
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('name, brand, price');
        
        if (productError) throw productError;

        const productsList = products.map(p => `- ${p.brand} ${p.name} (${p.price})`).join('\n');

        // Check if API key is present and valid-looking
        const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;

        if (!hasKey) {
            // Use Enhanced Local Fallback
            console.log("Using Local Fallback AI (No API Key found)");
            await new Promise(resolve => setTimeout(resolve, 800));
            const reply = generateLocalResponse(message, products);
            return res.json({ reply });
        }

        // Use Real Gemini AI with Inventory Context
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: getSystemPrompt(productsList) }],
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I have reviewed the current inventory and am ready to serve as the Royal Timepieces AI Concierge." }],
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Error generating AI response:", error);

        // Fallback to local if API fails
        try {
            const { data: products } = await supabase
                .from('products')
                .select('name, brand, price');
            const reply = generateLocalResponse(req.body.message || "", products || []);
            res.json({ reply });
        } catch (e) {
            res.json({ reply: "I apologize, but I am currently unable to access my records." });
        }
    }
});

export default router;

