import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: './.env' });

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-healthcare');
        console.log("✅ Connected to MongoDB");

        // Clear existing test users if desired (optional)
        // await User.deleteMany({ email: { $in: ['admin@test.com', 'doctor@test.com', 'patient@test.com'] } });

        const salt = await bcrypt.genSalt(10);

        const users = [
            {
                name: 'System Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin',
                mobileNumber: '9999999999'
            },
            {
                name: 'Dr. Sarah Smith',
                email: 'doctor@test.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '8888888888',
                specialty: 'Cardiologist',
                experience: 12,
                location: 'Chennai',
                qualifications: 'MBBS, MD',
                consultationFee: 500,
                availability: [
                    { day: 'Monday', time: '10:00 AM - 1:00 PM' },
                    { day: 'Wednesday', time: '2:00 PM - 5:00 PM' }
                ]
            },
            {
                name: 'John Patient',
                email: 'patient@test.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '7777777777'
            }
        ];

        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`✅ Created ${userData.role}: ${userData.email}`);
            } else {
                console.log(`ℹ️ User ${userData.email} already exists`);
            }
        }

        console.log("🚀 Seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
