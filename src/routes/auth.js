import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = await User?.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, password: hashedPassword });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: user.isNew ? 'User created and logged in' : 'Login successful',
            token,
            userId: user?._id
        });
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
