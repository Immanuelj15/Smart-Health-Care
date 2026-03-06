import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'Google ID Token is required.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // 1. Check if user exists with this googleId
        let user = await User.findOne({ googleId });

        if (!user) {
            // 2. Check if user exists with this email (if they registered normally before)
            user = await User.findOne({ email });

            if (user) {
                // Link googleId to existing user
                user.googleId = googleId;
                await user.save();
            } else {
                // 3. Create new user
                user = new User({
                    name,
                    email,
                    googleId,
                    role: 'patient', // Default role
                    // password not required for Google users
                });
                await user.save();
            }
        }

        // 4. Create JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            role: user.role,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                picture
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token.' });
    }
};
