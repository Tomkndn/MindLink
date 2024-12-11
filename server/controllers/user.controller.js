const User = require("../models/User.model");
const asyncHandler = require('express-async-handler');

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching user data" });
  }
};

const updateUserData = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      user.skills &&
      user.skills.length > 0 &&
      user.gender &&
      user.collegeOrSchool
    ) {
      user.profileUpdated = true;
      await user.save();
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error while updating user data" });
  }
};

const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {username: { $regex: req.query.search, $options: "i"} } : {};
  try {
    const users = await User.find({...keyword, _id:{$ne: req.user.id}});
    // const users = await User.find(keyword).find({_id:{$ne:req.user._id}});

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
})

module.exports = { getUserData, updateUserData, searchUsers };
