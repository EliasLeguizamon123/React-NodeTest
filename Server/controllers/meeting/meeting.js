const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
   try {
        const { agenda, attendes, attendesLead, location, related, dateTime, notes, createBy } = req.body

        const newMetting = new MeetingHistory({
            agenda,
            attendes,
            attendesLead,
            location,
            related,
            dateTime,
            notes,
            createBy
        })

        if (!agenda || !createBy) {
            return res.status(400).json({
                status: false,
                message: "Agenda and CreateBy are required fields",
            })
        }
        
        if (dateTime && new Date(dateTime) <= new Date()) {
            return res.status(400).json({
                status: false,
                message: "The meeting date must be in the future, please select a future date",
            })
        }

        await newMetting.save()
        .then((result) => {
            res.status(200).json({
                status: true,
                message: "Meeting Created Successfully",
                data: result
            })
        }).catch((err) => {
            res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err.message
            })
        });
   } catch (error) {
         res.status(500).json({ message: "Internal server error" })
    }
}

const index = async (req, res) => {
    try {
        const meetings = await MeetingHistory.find({ deleted: false })
            .sort({ timestamp: -1 })
            .populate('createBy', 'username');

        if (meetings.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No meetings found",
            });
        }

        const transformedMeetings = meetings.map(meeting => ({
            ...meeting.toObject(),
            createBy: meeting.createBy?.username || "-"
        }));
        
        res.status(200).json({
            status: true,
            message: "Meetings retrieved successfully",
            data: transformedMeetings,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const view = async (req, res) => {
    try {
        const meetingID = req.params.id
        const meeting = await MeetingHistory.findById(meetingID)
            .sort({ timestamp: -1 });

        if (!meeting) {
            return res.status(404).json({
                status: false,
                message: "Meeting not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Meeting retrieved successfully",
            data: meeting,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteData = async (req, res) => {
  try {
    const meetingID = req.params.id
    const meeting = await MeetingHistory.findById(meetingID)

    if (!meeting) {
        return res.status(404).json({
            status: false,
            message: "Meeting not found",
        });
    }

    meeting.deleted = true
    await meeting.save()

    res.status(200).json({
        status: true,
        message: "Meeting deleted successfully",
        data: meeting,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteMany = async (req, res) => {
    try {
        const meetingIDs = req.body;

        if (!meetingIDs || !Array.isArray(meetingIDs) || meetingIDs.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Invalid meeting IDs",
            });
        }

        const meetings = await MeetingHistory.updateMany(
            { _id: { $in: meetingIDs } },
            { deleted: true }
        )

        if (meetings.modifiedCount === 0) {
            return res.status(404).json({
                status: false,
                message: "No meetings found to delete",
            });
        }

        res.status(200).json({
            status: true,
            message: "Meetings deleted successfully",
            data: meetings,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { add, index, view, deleteData, deleteMany }