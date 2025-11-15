const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    author: { type: String, default: "Hostel Administration" },
  },
  {
    timestamps: true,
  },
);

NoticeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notice", NoticeSchema);
