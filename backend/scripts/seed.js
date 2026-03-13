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

        const users = [
            {
                name: 'System Admin',
                email: 'admin@premium.com',
                password: 'password123',
                role: 'admin',
                mobileNumber: '9876543210'
            },
            // Doctors
            {
                name: 'Dr. Sarah Smith',
                email: 'sarah.smith@smarthealth.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '9888877777',
                specialty: 'Cardiologist',
                experience: 12,
                location: 'Chennai',
                qualifications: 'MBBS, MD (Cardiology)',
                consultationFee: 800,
                availability: [
                    { day: 'Monday', time: '10:00 AM - 1:00 PM' },
                    { day: 'Wednesday', time: '2:00 PM - 5:00 PM' },
                    { day: 'Friday', time: '10:00 AM - 1:00 PM' }
                ]
            },
            {
                name: 'Dr. James Wilson',
                email: 'james.wilson@smarthealth.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '9777766666',
                specialty: 'Dermatologist',
                experience: 8,
                location: 'Bangalore',
                qualifications: 'MBBS, MD (Dermatology)',
                consultationFee: 600,
                availability: [
                    { day: 'Tuesday', time: '11:00 AM - 3:00 PM' },
                    { day: 'Thursday', time: '11:00 AM - 3:00 PM' }
                ]
            },
            {
                name: 'Dr. Elena Rodriguez',
                email: 'elena.rod@smarthealth.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '9666655555',
                specialty: 'Pediatrician',
                experience: 15,
                location: 'Mumbai',
                qualifications: 'MBBS, DNB (Pediatrics)',
                consultationFee: 700,
                availability: [
                    { day: 'Monday', time: '9:00 AM - 12:00 PM' },
                    { day: 'Thursday', time: '4:00 PM - 7:00 PM' }
                ]
            },
            {
                name: 'Dr. Arjun Kapoor',
                email: 'arjun.k@smarthealth.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '9555544444',
                specialty: 'Neurologist',
                experience: 10,
                location: 'Delhi',
                qualifications: 'MBBS, MD, DM (Neurology)',
                consultationFee: 1000,
                availability: [
                    { day: 'Wednesday', time: '10:00 AM - 2:00 PM' },
                    { day: 'Saturday', time: '10:00 AM - 1:00 PM' }
                ]
            },
            {
                name: 'Dr. Priya Sharma',
                email: 'priya.s@smarthealth.com',
                password: 'password123',
                role: 'doctor',
                mobileNumber: '9444433333',
                specialty: 'Gynecologist',
                experience: 7,
                location: 'Hyderabad',
                qualifications: 'MBBS, MS (OBG)',
                consultationFee: 500,
                availability: [
                    { day: 'Tuesday', time: '2:00 PM - 6:00 PM' },
                    { day: 'Friday', time: '9:00 AM - 1:00 PM' }
                ]
            },
            // Patients
            {
                name: 'Amit Kumar',
                email: 'amit.k@gmail.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '8888811111'
            },
            {
                name: 'Sneha Reddy',
                email: 'sneha.r@yahoo.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '8777722222'
            },
            {
                name: 'Rohan Mehta',
                email: 'rohan.m@outlook.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '8666633333'
            },
            {
                name: 'Anjali Gupta',
                email: 'anjali.g@gmail.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '8555544444'
            },
            {
                name: 'Vikram Singh',
                email: 'vikram.s@gmail.com',
                password: 'password123',
                role: 'patient',
                mobileNumber: '8444455555'
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

        console.log("🚀 Comprehensive seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
