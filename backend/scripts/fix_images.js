import mongoose from 'mongoose';
import Medicine from '../src/models/Medicine.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const fixBrokenImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-healthcare');
    console.log("✅ Connected to MongoDB");

    // High Quality Stable Medical Placeholder
    const fallbackUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000';

    // Find medicines with broken postimg links
    const brokenMedicines = await Medicine.find({ imageUrl: /postimg\.cc/ });
    console.log(`🔍 Found ${brokenMedicines.length} medicines with broken links.`);

    if (brokenMedicines.length > 0) {
      const result = await Medicine.updateMany(
        { imageUrl: /postimg\.cc/ },
        { $set: { imageUrl: fallbackUrl } }
      );
      console.log(`✅ Updated ${result.modifiedCount} medicine records with a premium placeholder image.`);
    }

    console.log("🚀 Repair completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Repair failed:", error);
    process.exit(1);
  }
};

fixBrokenImages();
