const Chat = require("../models/chat.model");
const User = require("../models/User.model");
const asyncHandler = require('express-async-handler');

// create or access single chat
const createSingleChat = asyncHandler(async(req, res) => {
    const {userId} = req.body;
    
    if(!userId){
        throw new CustomError(`UserId param not sent with request`, 404);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user.id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    }).populate("users", "-password")
      .populate("latestMessage");

    //populate latestMessage sender
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    });

    if(isChat.length > 0){
        res.status(200).send(isChat[0]);
    } else {
        // const user = await User.findOne({_id: userId});
        
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId]
        };

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            throw new CustomError(`Single chat not created`, 400);
        }
    }
});

// fetch all chats
const fetchChats = asyncHandler(async (req, res) => {
    // console.log(req.query.search);
    if(req.query.search===undefined){
        try {
            let result = await Chat.find({users: {$elemMatch: {$eq: req.user.id}} })
                                    .populate("users", "-password")
                                    .populate("groupAdmin", "-password")
                                    .populate("latestMessage")
                                    .sort({updatedAt: -1})    //recently updated chats will appear first.
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name email"
            })
    
            res.status(200).send(result);
        } catch (error) {
            throw new CustomError(error.message, 400);
        }
        
    } else {
        const keyword = req.query.search ? {
            $or: [{chatName: {$regex: req.query.search, $options: "i"}}]
        } : {};
        
        const chats = await Chat.find(keyword);
        if(chats.length === 0){
            res.status(200).json({message: `No chats found with query ${req.query.search}`});
            // throw new CustomError(`No chats found with query ${req.query.search}`, 400);
        }
        else {
            res.status(200).json(chats);
        }
    }
});

// create group chat
const createGroupChat= asyncHandler( async (req, res) => {
    if(!req.body.users || !req.body.name) {
        throw new CustomError("Please fill all the fields", 400);
    }
    // we will get a stringified array of users
    let users = JSON.parse(req.body.users);

    if(users.length < 2){
        throw new CustomError("More than 2 users are required to form a group chat", 400);
    }
    users.push(req.user.id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.id,
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        throw new Error(error.message || "An error occurred while creating the group chat", 400);
    }
});

// Rename Group 
const renameGroup = asyncHandler( async(req, res) => {
    const {chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName: chatName}, {new: true})  // with new returns the updated document.
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password");
    if(!updatedChat) {
        throw new CustomErrorError("chat name not updated", 404);  
    }

    res.status(200).json(updatedChat);
});

// add to group
const addToGroup = asyncHandler( async (req, res) => {
    const {chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId},}, {new: true})
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");

    if(!added) {
        throw new Error("User not added to chat", 404);    
    } else {
        res.status(200).json(added);
    }
});

// remove from group
const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId},}, {new: true})
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");

    if(!removed) {
        throw new Error("User not removed from chat", 404);        
    } else {
        res.status(200).json(removed);
    }
});

module.exports={
    createSingleChat, 
    fetchChats, 
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}