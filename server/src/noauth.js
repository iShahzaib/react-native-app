import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDBConnection from './database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, profilepicture } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = await getDBConnection('MSH_CONTACTAPP');

        // Check for existing user
        const existingUser = await db.collection('User').findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            profilepicture,
            IsAccessible: true,
            createdAt: new Date()
        };

        const result = await db.collection('User').insertOne(newUser);

        res.status(201).json({ message: 'success', userId: result.insertedId });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const user = await db.collection('User').findOne({ email, IsAccessible: true });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token (expires in 1 hour)
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        delete user.password;

        res.status(200).json({ message: 'success', token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

export default router;