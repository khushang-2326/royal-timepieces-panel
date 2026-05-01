import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get user count
router.get('/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, username, email, phone, image, bio, cart, wishlist, address, created_at');
        
        if (error) throw error;
        
        const mappedUsers = users.map(u => ({ ...u, _id: u.id }));
        res.json(mappedUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') return res.status(404).json({ message: 'User not found' });
            throw error;
        }
        
        res.json({ ...user, _id: user.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    console.log('Update User Request:', req.body);
    try {
        const { currentPassword, ...updates } = req.body;
        
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (findError) throw findError;
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify password
        if (!currentPassword || user.password !== currentPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const supabaseUpdates = {};
        if (updates.username) supabaseUpdates.username = updates.username;
        if (updates.email) supabaseUpdates.email = updates.email;
        if (updates.bio) supabaseUpdates.bio = updates.bio;
        if (updates.image) supabaseUpdates.image = updates.image;
        if (updates.password) supabaseUpdates.password = updates.password;

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(supabaseUpdates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (updateError) throw updateError;
        
        res.json({ message: 'Profile updated successfully', user: { ...updatedUser, _id: updatedUser.id } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user (using POST to ensure body is received)
router.post('/:id/delete', async (req, res) => {
    try {
        const { password } = req.body;
        
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('password')
            .eq('id', req.params.id)
            .single();
        
        if (findError) throw findError;
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!password || user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user cart
router.put('/:id/cart', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ cart: req.body.cart })
            .eq('id', req.params.id)
            .select('cart')
            .single();

        if (error) throw error;
        res.json(data.cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user wishlist
router.put('/:id/wishlist', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ wishlist: req.body.wishlist })
            .eq('id', req.params.id)
            .select('wishlist')
            .single();

        if (error) throw error;
        res.json(data.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user checkout info (address and phone)
router.put('/:id/checkout-info', async (req, res) => {
    try {
        const updates = {};
        if (req.body.address) updates.address = req.body.address;
        if (req.body.phone) updates.phone = req.body.phone;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.params.id)
            .select('address, phone')
            .single();

        if (error) throw error;
        res.json({ message: 'Checkout info updated', address: data.address, phone: data.phone });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

