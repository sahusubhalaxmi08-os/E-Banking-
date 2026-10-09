import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  res.json({
    success: true,
    notification,
  });
});