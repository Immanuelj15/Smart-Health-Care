import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments({ role: 'doctor' });
        console.log('--- Database Diagnostic ---');
        console.log('Total Doctors found:', count);
        
        if (count > 0) {
            const doctors = await User.find({ role: 'doctor' }).limit(3);
            doctors.forEach(doc => {
                console.log(`- Doctor: ${doc.name} | Specialty: ${doc.specialty} | Location: ${doc.location}`);
            });
        }
        
        console.log('---------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

check();
