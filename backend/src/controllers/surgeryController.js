import Surgery from '../models/Surgery.js';

export const getAllSurgeries = async (req, res) => {
  try {
    const surgeries = await Surgery.find({});
    res.json(surgeries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getSurgeryById = async (req, res) => {
  try {
    const surgery = await Surgery.findById(req.params.id);
    if (!surgery) return res.status(404).json({ message: 'Surgery not found' });
    res.json(surgery);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};