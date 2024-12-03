const User = require("../models/User.model");

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

module.exports = { getUserData, updateUserData };
