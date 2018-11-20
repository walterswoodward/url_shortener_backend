const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shortUrl: String,
  newUrl: String,
}, {timestamps: true});

// `shortUrl` is the collection/table
// `urlSchema` is the structure
const ModelClass = mongoose.model('shortUrl', urlSchema)

module.exports = ModelClass; 