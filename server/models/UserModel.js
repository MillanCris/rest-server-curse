const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rol_valid_list = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} this isn\'t a valid rol'
};

let status_valid_list = {
    values: [true, false, 'DELETE'],
    message: '{VALUE} this isn\'t a valid rol'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        require: [true, 'password is required'],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rol_valid_list
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {

    let clean_user = this;
    let user_object = clean_user.toObject();
    delete user_object.password;

    return user_object;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unio' });

module.exports = mongoose.model('user', userSchema);