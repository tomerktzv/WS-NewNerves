'use strict';

const mongoose = require('mongoose'),
      consts = require('../consts'),
      promise = require('promise'),
      Songs = require('./songs_mdl'),
      Mixes = require('./mixes_mdl'),
      Users = require('./users_mdl');

mongoose.connect(consts.MLAB_KEY);
var conn = mongoose.connection;


conn.on('error', (err) => {
    console.log(`connection error: ${err}`);
});

//Abstract Find query
function abstractFindModel(model,_query,errMsg){
    return new Promise((resolve, reject) => {
        model.find(_query ,'-_id',
            (err, result) => {
                if (err)  reject(err);
                else {
                    if(result.length !== 0) resolve(result);
                    else resolve(errMsg);
                }
            });
    });
}
//Abstract Insert Method
function abstractInsertModel(model) {
    return new Promise((resolve, reject) => {
            model.save((err) => {
                if (err) reject(err);
                else {
                    console.log(`Saved document: ${JSON.stringify(model)}`);
                    resolve({"Success":"Data was saved"});
                }
            });
    });
}
//Abstract Update Method
function abstractUpdateModel(model, conditions, update, opts) {
    return new Promise((resolve, reject) => {
        model.update(conditions, update, opts, (err, result) => {
            if (err) reject(err);
            else {
                console.log(`User with ID ${conditions.id}'s was successfully changed updated`);
                console.log(`\nResult message: ${result}`);
                resolve({"Success":"Data was updated"});
            }
        });
    });
}

class MusicPlayer {

    getAllSongs(){
        return abstractFindModel(Songs,{},{"Error":"No Songs were found"});
    }

    getSongByID(_id) {
        return abstractFindModel(Songs,{id: _id},{"Error":"No Songs were found"});
    }

    getSongsByTitle(_title){
        return abstractFindModel(Songs,{title:_title},{"Error":"the specific Song was not found"});
    }

    getSongsByGenre(_genre) {
        return abstractFindModel(Songs,{genre:_genre},{"Error":"Genre doesn't exist"});
    }

    getSongsByArtist(_artist) {
        return abstractFindModel(Songs,{artist:_artist},{"Error":"Artist doesn't exist"});
    }

    // USERS Methods
    getAllUsers() {
        return abstractFindModel(Users,{},{"Error":"No Users were found"});
    }

    getUserByID(_id) {
        return abstractFindModel(Users,{id:_id},{"Error":"Users was not found"});
    }

    addNewUser(_id, _name, _profilepic) {
        let newUser = new Users({
            id: _id,
            name: _name,
            profilepic: _profilepic
        });
        return abstractInsertModel(newUser);
    }

    updateUserName(_id, _name) {
        return new Promise((resolve, reject) => {
            try {
                    abstractFindModel(Users,{id :_id}, {"Error":"Users was not found"}).then((result) => {
                        if (result.hasOwnProperty(`Error`)) {
                            resolve ({"Error" : `No user with ${_id} was found`});
                        }
                        else {
                            let conditions = {id: _id},
                            update = {$set: {name: _name}},
                            opts = {multi: true};
                            resolve(abstractUpdateModel(Users, conditions, update, opts));
                        }
                });
            }
            catch(error) {
                reject(error);
            }
        });

    }

    updateUserProfilePic(_id, _profilepic) {
        let conditions = {id: _id},
            update = {$set: {profilepic: _profilepic}},
            opts = {multi: true};
        return abstractUpdateModel(Users, conditions, update, opts);
    }

    // MIXES Methods
    getAllMixes() {
        return abstractFindModel(Mixes,{},{"Error":"No Mixes were found"});
    }

    getMixesByUserID(_id){
        return abstractFindModel(Mixes,{userid:_id},{"Error":"No Mixes for user were found"});
    }

    getMixesByHashtags(_tag){
        return abstractFindModel(Mixes,{hashtags:_tag},{"Error":"No Mixes with current hashtag were found"});
    }

    addNewMix(_userid, _mixname) {
        let randomMixId = Math.floor(Math.random() * (1000 - 1) + 1);
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{id :_userid}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id ${_userid} was found`});
                    }
                    else {
                        let newMix = new Mixes({
                            songs: [],
                            userid: _userid,
                            mixid: randomMixId,
                            mixname: _mixname,
                            likes: 0,
                            heard: 0,
                            comments: [],
                            hashtags: []
                        });
                        resolve(abstractInsertModel(newMix));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    addHashTagToMix(_userid, _mixid, _hashtag) {
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{id :_userid}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id ${_userid} was found`});
                    }
                    else {
                        let conditions = {userid: _userid, mixid: _mixid},
                            update = {$push: {hashtags: _hashtag}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    addCommentToMix(_userid, _mixid, _comment) {
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{id :_userid}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id ${_userid} was found`});
                    }
                    else {
                        let conditions = {userid: _userid, mixid: _mixid},
                            update = {$push: {comments: _comment}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    addSongToMix(_userid, _mixid, _songid) {
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{id :_userid}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id ${_userid} was found`});
                    }
                    else {
                        let conditions = {userid: _userid, mixid: _mixid},
                            update = {$push: {songs: _songid}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }
}

module.exports = () => {
    return new MusicPlayer()
};