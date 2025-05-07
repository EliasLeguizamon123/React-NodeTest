const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
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

   // Validate required fields
   if (!agenda || !createBy) {
    return res.status(400).json({
        status: false,
        message: "Agenda and CreateBy are required fields",
    })
   }

   // Validate dateTime format
   if (dateTime && !mongoose.isValidObjectId(dateTime)) {
    return res.status(400).json({
        status: false,
        message: "Invalid date format",
    })
   }

   // Validate dateTime is in the future
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
}

const index = async (req, res) => {
    
}

const view = async (req, res) => {
    
}

const deleteData = async (req, res) => {
  
}

const deleteMany = async (req, res) => {
    
}

module.exports = { add, index, view, deleteData, deleteMany }