const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true ,
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    },
    admin: { 
        type: String, 
        required: true 
    },
    privacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
        required: true
    },
    permissions: {
        edit: { type: Boolean, default: false }, 
        view: { type: Boolean, default: true }  
    },
    members: [
        { 
            user: { 
                // type: mongoose.Schema.Types.ObjectId, 
                // ref: 'User' 
                type : String,
                required: true
                
            },
            role: {
                type: String,
                enum: ['member', 'admin'], 
                default: 'member'
            },
            invited: {
                type: Boolean,
                default: false
            }
        }
    ],
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            content: { 
                type: String, 
                required: true 
            },
            media: {
                type: String 
            },
            timestamp: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    invites: [
        {
            invitedUser: { 
                type: String, 
                required: true 
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending'
            },
            invitedAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
