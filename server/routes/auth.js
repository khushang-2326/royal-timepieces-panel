import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    const { username, email, password } = req.body;

    try {
        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (findError) throw findError;
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { error: insertError } = await supabase
            .from('users')
            .insert([{ username, email, password }]);

        if (insertError) throw insertError;

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful', 
            user: { id: user.id, _id: user.id, username: user.username, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', adminId: admin.id, _id: admin.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Initial Admin
router.post('/admin/create', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: existingAdmin, error: findError } = await supabase
            .from('admins')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (findError) throw findError;
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const { error: insertError } = await supabase
            .from('admins')
            .insert([{ email, password }]);

        if (insertError) throw insertError;

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

