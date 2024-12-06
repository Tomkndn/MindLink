const mongoose = require("mongoose");
const User = require("./User.model");

const MeetingSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    organizer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    privacy:{
        type:String,
        enum: ['public', 'private'],
        default: 'public',
        required: true  
    },
    participants: [
        { 
            username : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            invited :{
                type : Boolean, 
                default: false
            }
        }
    ],
    attendees: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }],
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'canceled'],
        default: 'scheduled'
    },
},{ timestamps: true })

module.exports = mongoose.model("Meeting", MeetingSchema);