import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        const orders = data.map(o => ({ ...o, _id: o.id }));
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create an order
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                customer: req.body.customer,
                product: req.body.product,
                items: req.body.items,
                amount: req.body.amount,
                status: req.body.status || 'Processing',
                address: req.body.address,
                mobile: req.body.mobile,
                email: req.body.email,
                payment_method: req.body.paymentMethod,
                payment_status: req.body.paymentStatus
            }])
            .select()
            .single();

        if (error) throw error;

        const newOrder = { ...data, _id: data.id };
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

