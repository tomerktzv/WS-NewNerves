const mongoose = require('mongoose'),
      schema = mongoose.Schema,
      mixSchema = new schema({
          songs: [Number],
          userid:{type: Number, required: true},
          mixid: {type: Number, unique: true},
          mixname: {type: String, required: true},
          likes: Number,
          heard: Number,
          comments: [{type: String}],
          hashtags: [{type: String}]
      },
          {versionKey: false},
          {collection: 'mixes'});

const Mixes = mongoose.model('mixes', mixSchema);

module.exports = Mixes;