import MedicalRecord from '../models/MedicalRecord.js';

// @desc    Upload a new medical record/claim
// @route   POST /api/records/upload
// @access  Private (Patient)
export const uploadRecord = async (req, res) => {
    try {
        const { title } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = req.file.path; // Cloudinary URL from middleware

        const record = new MedicalRecord({
            user: req.user._id,
            title,
            fileUrl,
            status: 'Pending'
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged-in user's records
// @route   GET /api/records/my-records
// @access  Private
export const getMyRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all records (Admin)
// @route   GET /api/records/all
// @access  Private (Admin)
export const getAllRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update record status (Approve/Reject)
// @route   PUT /api/records/:id/status
// @access  Private (Admin)
export const updateRecordStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        record.status = status;
        await record.save();
        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
