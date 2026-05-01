import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) throw error;
        
        // Map id to _id for frontend compatibility
        const products = data.map(p => ({ ...p, _id: p.id }));
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') return res.status(404).json({ message: 'Product not found' });
            throw error;
        }
        
        const product = { ...data, _id: data.id };
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a product
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                stock: req.body.stock,
                image: req.body.image,
                description: req.body.description
            }])
            .select()
            .single();

        if (error) throw error;

        const newProduct = { ...data, _id: data.id };
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.brand) updates.brand = req.body.brand;
        if (req.body.price) updates.price = req.body.price;
        if (req.body.category) updates.category = req.body.category;
        if (req.body.stock !== undefined) updates.stock = req.body.stock;
        if (req.body.image) updates.image = req.body.image;
        if (req.body.description) updates.description = req.body.description;
        updates.updated_at = new Date();

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') return res.status(404).json({ message: 'Product not found' });
            throw error;
        }

        const updatedProduct = { ...data, _id: data.id };
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

