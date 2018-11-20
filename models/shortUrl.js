// template/structure/model of document for shortURL
const mongoose = require('mongoose');
// No need to create a primary key because mongoose does it automatically!
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