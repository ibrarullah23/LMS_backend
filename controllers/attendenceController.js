const Attendance = require("../models/Attendance");
const ClassModel = require("../models/ClassModel");
const User = require("../models/User");

exports.addClass = async (req, res) => {
    const { className, Description } = req.body;
    try {
        const data = new ClassModel({ className, Description });
        const savedClass = await data.save()

        if (!savedClass) {
            throw new Error('Failed to add new class');
        }

        const students = await User.find({});
        const newAttandance = students.map(d => ({
            userId: d._id,
            classId: savedClass._id
        }))

        const savedAttandance = await Attendance.insertMany(newAttandance);

        if (!savedAttandance) {
            throw new Error('Failed to add new attandance.');
        }

        res.status(201).json({ message: 'New Class Added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find({});
        const classCount = classes.length;

        res.status(200).json({classes,classCount});
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateAttendanceStatus = async (req, res) => {
    const { userId, classId } = req.body;
    try {
        const found = await Attendance.findOne({ userId, classId });
        if (found) {
            return res.status(404).json({ message: 'Attendance already added' });
        }
        const updatedAttendance = await Attendance.findOneAndUpdate(
            { userId, classId },
            "Present" ,
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance status updated successfully', updatedAttendance });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendanceByStuId = async (req, res) => {
    const { id } = req.params;
    try {
        const allAttendance = await Attendance.find({ userId: id }).populate({
            path: 'classId', 
            select: 'className Description'
        });
        res.status(200).json(allAttendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAttendanceofClass = async (req, res) => {
    const { id } = req.params;

    try {
        const attendanceRecords = await Attendance.find({classId: id})
        .populate({
            path: 'userId',
            select: 'username'
        });
        // id not matched return [] so no need of error
        // if (!attendanceRecords) {
        //     return res.status(404).json({ message: 'Class not found' });
        // }
        res.status(200).json({attendanceRecords});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

     // try {
    //     const classInfo = await ClassModel.findOne({ className });
    //     if (!classInfo) {
    //         return res.status(404).json({ message: 'Class not found' });
    //     }
    //     const attendanceRecords = await Attendance.find({ classId: classInfo._id });
    //     res.status(200).json(attendanceRecords);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
};

exports.getAttendanceCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const counts = await Attendance.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            present: 0,
            absent: 0,
            percentage: 0
        };

        counts.forEach(count => {
            result[count._id] = count.count;
        });

        const total = result.present + result.absent;
        if (total > 0) {
            result.percentage = (result.present / total) * 100;
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance counts', error });
    }
};


