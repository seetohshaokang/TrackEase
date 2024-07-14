const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
  userId: String,
  query: String,
  date: { type: Date, default: Date.now },
});

const SearchLog = mongoose.model("SearchLog", searchLogSchema);
module.exports = SearchLog;
