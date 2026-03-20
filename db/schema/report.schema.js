import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  reportDate: {
    type: Date,
    required: true,
  },
  reportTime: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    enum: ["injury", "deceased", "relocation", "food and water", "adoption"],
    required: true,
  },
  organisedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
});

const Report =
  mongoose.models?.Report || mongoose.model("Report", reportSchema);
export default Report;
