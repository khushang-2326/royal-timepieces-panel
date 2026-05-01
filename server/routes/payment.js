import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData // The rest of the order details to save
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Save order to database
            const { data: newOrder, error } = await supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    payment_method: 'Razorpay',
                    payment_status: 'Paid',
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                }])
                .select()
                .single();

            if (error) throw error;

            res.json({
                message: 'Payment verified successfully',
                orderId: newOrder.id,
                _id: newOrder.id
            });
        } else {
            res.status(400).json({
                error: 'Invalid signature'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

