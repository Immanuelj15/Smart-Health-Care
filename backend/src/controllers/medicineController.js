import Medicine from '../models/Medicine.js';


// Admin: Add a new medicine


export const addMedicine = async (req, res) => {
  try {
    const { name, manufacturer, price, stock, category, description } = req.body;
    
    // ✅ The image URL now comes from the uploaded file's path
    const imageUrl = req.file.path; 

    const newMedicine = new Medicine({
      name, manufacturer, price, stock, category, description, imageUrl,
    });
    
    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (getAllMedicines is unchanged)
// Public: Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      res.json(medicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};