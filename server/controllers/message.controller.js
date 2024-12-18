const Chat = require("../models/chat.model");
const User = require("../models/User.model");
const Message = require("../models/message.model");
const asyncHandler = require("express-async-handler");

// Send Messages
const sendMessage = asyncHandler( async(req, res) => {
    const {content, chatId, contentType} = req.body;

    if(!content || !chatId) {
        throw new CustomError("Invalid data passed into request", 400)
    }
    let newMessage = {
        sender: req.user.id,
        content: content,
        contentType: contentType,
        chat: chatId,
    }

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.status(200).json(message);
    } catch (error) {
        throw new CustomError(error.message || "Error happend while sending message", 400);
    }
});


// Get All messages
const getAllMessages = asyncHandler( async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId })
                                .populate("sender", "name email")
                                .populate("chat");
        res.json(messages);
    } catch (error) {
        throw new Error(error.message || "not able fetched all messages for this chat", 400)
    }
});

module.exports= {sendMessage, getAllMessages};
