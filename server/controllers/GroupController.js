const Group = require('../models/GroupModel');
const User = require('../models/User.model');
const mongoose=require('mongoose')
const {encryptMessage,decryptMessage}=require('../middleware/cryptoUtils');
// Create a new group
module.exports.createGroup = async (req, res) => {
    try {
        const { name, description, privacy, permissions } = req.body;
        const group = await Group.create({
            name,
            description,
            privacy,
            permissions,
            admin: req.user.id, 
        });

        res.status(201).json({ message: 'Group created successfully!', group });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
};
// Get all groups 
module.exports.getGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await Group.find({
            $or: [
                { privacy: 'public' },
                { admin: userId }
            ]
        }).populate('admin', 'username');

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
    }
};

// Get a single group by ID
module.exports.getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID format' });
        }
        const group = await Group.findById(groupId)
            .populate('admin', 'username')           
            .populate('members.user', 'username')    
            .populate('messages.sender', 'username') 
            .exec(); 

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group:', error);  
        return res.status(500).json({ message: 'Failed to fetch group', error: error.message });
    }
};

// Update group details (Admin only)
module.exports.updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const adminId = req.user.id;
        const updates = req.body;

        const group = await Group.findOneAndUpdate(
            { _id: groupId, admin: adminId },
            updates,
            { new: true }
        );

        if (!group) return res.status(404).json({ message: 'Group not found or unauthorized' });

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update group', error: error.message });
    }
};

// Delete a group (Admin only)
module.exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const adminId = req.user.id;

        const group = await Group.findOneAndDelete({ _id: groupId, admin: adminId });

        if (!group) return res.status(404).json({ message: 'Group not found or unauthorized' });

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete group', error: error.message });
    }
};

// Join a public group
module.exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        const group = await Group.findById(groupId);

        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (group.privacy === 'private') {
            return res.status(403).json({ message: 'Cannot join private group' });
        }

        if (group.members.some(member => member.user.toString() === userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        group.members.push({ user: userId });
        await group.save();

        res.status(200).json({ message: 'Joined group successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join group', error: error.message });
    }
};

module.exports.inviteUser = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { invitedUserEmail } = req.body; 
        const adminId = req.user.id;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (group.invites.some(invite => invite.invitedUser === invitedUserEmail)) {
            return res.status(400).json({ message: 'User already invited' });
        }

        group.invites.push({ invitedUser: invitedUserEmail, status: 'pending' });
        await group.save();

        res.status(200).json({
            message: 'User invited successfully',
            invitation: {
                invitedUser: invitedUserEmail,
                groupId: group._id,
                status: 'pending',
                invitedAt: new Date(),
            }
        });
    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ message: 'Failed to invite user', error: error.message });
    }
};

 module.exports.getNotifyaboutInvites = async (req, res) => {
    try {
        const { userEmail } = req.body;

        const groups = await Group.find({
            invites: { 
                $elemMatch: { invitedUser: userEmail, status: "pending" } 
            }
        }).select('name description privacy invites');

        if (!groups.length) {
            return res.status(200).json({ message: "You are not invited to any groups." });
        }

        return res.status(200).json({
            message: "Successfully retrieved groups",
            groups
        });
    } catch (error) {
  
        return res.status(500).json({
            message: 'Failed to fetch invites',
            error: error.message
        });
    }
};
 
module.exports.acceptGroupInvite = async (req, res) => {
    try {
        const { userEmail, groupId } = req.body;
        console.log(userEmail);
        console.log(groupId);
   
        if (!groupId || !userEmail) {
            return res.status(400).json({ message: "Missing groupId or userId" });
        }
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
        const checkgroup = await Group.findById(groupObjectId);
        
        console.log(checkgroup);
        if(!checkgroup){
            console.log("group not found")
            return res.status(404).json({ message: "Group not found" });
        }
        console.log(groupObjectId)

        const updatedGroup = await Group.findOneAndUpdate(
            {
                _id: groupObjectId,
                "invites.invitedUser": userEmail,
                "invites.status": "pending",
            },
            {
                $set: { "invites.$.status": "accepted" },
                $push: { members: { user: userEmail } },
            },
            { new: true }
        );
        console.log(updatedGroup);

        if (!updatedGroup) {
            console.error("No group found or invite already processed.");
            return res.status(404).json({ message: "Invite not found or already processed." });
        }
        
        return res.status(200).json({
            message: "Group invite accepted successfully.",
            group: updatedGroup,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to accept the invite.",
            error: error.message,
        });
    }
};

// Reject an invitation to join a group
module.exports.rejectGroupInvite = async (req, res) => {
    try {
        const { userEmail, groupId } = req.body;
        console.log(userEmail);
        console.log(groupId);
        if (!groupId || !userEmail) {
            return res.status(400).json({ message: "Missing groupId or userId" });
        }
        const updatedGroup = await Group.findOneAndUpdate(
            {
                _id: groupId,
                "invites.invitedUser": userEmail,
                "invites.status": "pending",
            },
            {
                $set: { "invites.$.status": "declined" },
            },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({
                message: "Invite not found or already processed.",
            });
        }

        return res.status(200).json({
            message: "Group invite declined successfully.",
            group: updatedGroup,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to decline the invite.",
            error: error.message,
        });
    }
};

module.exports.getGroupsByMember = async (req, res) => {
    try {
        const { userEmail } = req.body; 

        if (!userEmail) {
            return res.status(400).json({ message: "User email is required" });
        }

        const groups = await Group.find({
            "members.user": userEmail
        }).select('name description privacy admin'); 

        if (!groups.length) {
            return res.status(404).json({ message: "You are not a member of any groups." });
        }

        return res.status(200).json({
            message: "Successfully retrieved member groups",
            groups
        });
    } catch (error) {
        console.error("Error fetching member groups:", error);
        return res.status(500).json({
            message: "Failed to fetch groups where the user is a member.",
            error: error.message
        });
    }
};

module.exports.getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('messages.sender', 'email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.messages || group.messages.length === 0) {
            return res.status(200).json({ messages: [], message: 'No messages found in this group' });
        }
        const decryptedMessages = group.messages.map(message => {
            try {
                if (!message.content || !message.content.includes(':')) {
                    throw new Error('Invalid encrypted message format');
                }

                return {
                    ...message.toObject(),
                    content: decryptMessage(message.content),
                };
            } catch (error) {
                console.error(`Error decrypting message ID ${message._id}:`, error.message);
                return {
                    ...message.toObject(),
                    content: '[Decryption failed]',
                };
            }
        });

        res.status(200).json({ messages: decryptedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};


module.exports.sendMessage = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { content, sender } = req.body; 

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const encryptedContent = encryptMessage(content);  

        const newMessage = {
            sender: sender, 
            content: encryptedContent, 
            timestamp: new Date(),
        };

        group.messages.push(newMessage);
        await group.save();

   
        res.status(200).json({
            message: 'Message sent',
            newMessage: {
                sender: newMessage.sender,
                content: content,
                timestamp: newMessage.timestamp,
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};


