const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    work: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            name: {
                type: String,
                required: true,

            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            subject:{
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 8);
        this.cpassword = bcrypt.hashSync(this.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (error) {
        console.log(error);
    }

}

userSchema.methods.addMessage = async function (name, email, phone, subject, message) {
    try {
        this.messages = this.messages.concat({name, email, phone, subject, message});
        await this.save();
        return this.messages;
        }
        catch (error) {
            console.log(error);
        }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;