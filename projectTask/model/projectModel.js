var mongoose = require("mongoose");

// Connection code
mongoose.connect(
  "mongodb://127.0.0.1:27017/projectAdmin",
  { useMongoClient: true }
);

var Schema = mongoose.Schema;

const userData = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    age: { type: Number, required: true }
    // imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const formData = new Schema(
  {
    name: { type: String, required: true },
    shape: { type: String, required: true },
    reminder: { type: String, required: true, default: "Not set" },
  },
  { timestamps: true }
);

var projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    form: [formData],
    user: [userData],
    symbol: { type: String, required: true }
  },
  { timestamps: true }
);

var projectDetails = mongoose.model("projectDetails", projectSchema);
module.exports = projectDetails;
