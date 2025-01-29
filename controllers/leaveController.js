// const mongoose = require('mongoose');
const LeaveRequest = require("../models/LeaveRequest");
// const User = require("../models/User");

exports.newLeaveRequest = async (req, res) => {
    const { userId, startDate, endDate, reason } = req.body;

    try {
        const leaveRequest = new LeaveRequest({
            userId,
            startDate,
            endDate,
            reason,
        });

        const savedLeaveRequest = await leaveRequest.save();
        res.status(201).json(savedLeaveRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRequestByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const leaveRequests = await LeaveRequest.find()
            .populate({
                path: 'userId',
                match: { username },
                select: 'username',
            });

        const filteredLeaveRequests = leaveRequests.filter(lr => lr.userId);

        if (filteredLeaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this user' });
        }

        res.status(200).json(filteredLeaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRequestById = async (req, res) => {
    const { userId } = req.params;

    try {
        const leaveRequest = await LeaveRequest.find({ userId });
        if (leaveRequest) {
            return res.status(404).json({ message: 'No leave requests found for this user' });
        }
        res.status(200).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLeaveRequestStatus = async (req, res) => {
    const { id, status } = req.body;

    try {
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedLeaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json(updatedLeaveRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};