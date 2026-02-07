import axios from 'axios';

// @desc    Analyze food image for nutrition info
// @route   POST /api/nutrition/analyze
// @access  Protected
export const analyzeFood = async (req, res) => {
  try {
    // Check if an image file was provided
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // In a real production app, we would:
    // 1. Upload the image to Cloudinary (already configured)
    // 2. Pass the public URL to Spoonacular API
    // However, Spoonacular also accepts raw image data or requires a hosted URL.
    // For this POC, we will use a mock response if no API key is set, 
    // or try to call the API if the key exists.
    
    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
       console.warn("⚠️ No SPOONACULAR_API_KEY found. Returning mock data.");
       // return res.status(503).json({ message: "Service unavailable: API Key missing" });
       
       // MOCK RESPONSE FOR DEMO
       return res.status(200).json({
         recipes: [],
         nutrition: {
            calories: { value: 250, unit: 'kcal' },
            protein: { value: 12, unit: 'g' },
            fat: { value: 10, unit: 'g' },
            carbs: { value: 30, unit: 'g' }
         },
         category: { name: 'Burger', probability: 0.95 }
       });
    }

    // Example call to Spoonacular (requires image URL)
    // const response = await axios.post(`https://api.spoonacular.com/food/images/classify?apiKey=${apiKey}`, ...);

    // For now, let's pretend we called it.
     return res.status(200).json({
         message: "API Key present but real logic requires remote image hosting.",
         nutrition: {
            calories: { value: 320, unit: 'kcal' },
            protein: { value: 20, unit: 'g' },
            fat: { value: 15, unit: 'g' },
            carbs: { value: 40, unit: 'g' }
         },
         category: { name: 'Detected Food', probability: 0.88 }
       });

  } catch (error) {
    console.error('Nutrition Scan Error:', error);
    res.status(500).json({ message: 'Server Error during analysis' });
  }
};
