import mongoose from 'mongoose';

const surgerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ailments: [String],
  image: { type: String, required: true }, // URL to an image
});

const Surgery = mongoose.model('Surgery', surgerySchema);
export default Surgery;