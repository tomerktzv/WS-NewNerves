/**
 * Created by Nir Mekin on 6/15/2017.
 */
var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    userSchema = new schema({
        name: {type: String, index: 1, required: true},
        id: {type: Number, required: true , unique:true},
        profilepic: {type: String, index: 1}
    },
        {versionKey: false},
        {collection: 'users'});

var Users = mongoose.model('users',userSchema);

module.exports = Users;