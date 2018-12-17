"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leveldb_1 = require("./leveldb");
class User {
    constructor(username, email, password, passwordHashed = false) {
        this.username = username;
        this.email = email;
        this.password = password;
        // if (!passwordHashed) {
        //   this.setPassword(password)
        // } else this.password = password
    }
    static fromDb(username, value) {
        const [password, email] = value.split(":");
        return new User(username, email, password);
    }
    setPassword(toSet) {
        // Hash and set password
    }
    getPassword() {
        return this.password;
    }
    validatePassword(toValidate) {
        // return comparison with hashed password
        return (toValidate == this.password);
    }
}
exports.User = User;
class UserHandler {
    get(username, callback) {
        this.db.get(`user:${username}`, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, User.fromDb(username, data));
        });
    }
    save(user, callback) {
        console.log(user.username);
        this.db.put(`user:${user.username}`, `${user.password}:${user.email}`, (err) => {
            callback(err);
        });
    }
    delete(username, callback) {
        // TODO
    }
    constructor(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
}
exports.UserHandler = UserHandler;
