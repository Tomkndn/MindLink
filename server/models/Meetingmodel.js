const mongoose = require('mongoose');

const MeetingSchema = mongoose.Schema({
    title: { 
        type: String,
        unique : true,
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
    passowrd : {
       type: String,
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
    createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
},{ timestamps: true })

MeetingSchema.virtual('isPublic').get(function() {
    return this.privacy === 'public';
});

MeetingSchema.methods.inviteParticipant = function(userId) {
    if (this.privacy === 'private') {
      const participant = this.participants.find(p => p.username.toString() === userId.toString());
      if (participant) {
        participant.invited = true;
      } else {
        this.participants.push({ username: userId, invited: true });
      }
    }
};

MeetingSchema.methods.addAttendee = function(userId) {
    if (this.privacy === 'public') {
      if (!this.attendees.includes(userId)) {
        this.attendees.push(userId);
      }
    } else {
      // For private meetings, check if the user has been invited
      const participant = this.participants.find(p => p.username.toString() === userId.toString());
      if (participant && participant.invited) {
        if (!this.attendees.includes(userId)) {
          this.attendees.push(userId);
        }
      } else {
        throw new Error('User is not invited to this private meeting');
      }
    }
  };
  
  module.exports = mongoose.model('Meeting', MeetingSchema);