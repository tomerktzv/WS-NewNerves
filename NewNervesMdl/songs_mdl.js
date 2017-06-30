const mongoose = require('mongoose'),
      schema = mongoose.Schema,
      songSchema = new schema({
          title: {type: String, index: 1, required: true},
          artist: {type: String, index: 1, required: true},
          id: Number,
          duration: Number,
          cover: {type: String, index: 1, required: true},
          genre: {type: String, index: 1, required: true},
      },
          {versionKey: false},
          {collection: 'songs'});

const Songs = mongoose.model('songs', songSchema);

module.exports = Songs;