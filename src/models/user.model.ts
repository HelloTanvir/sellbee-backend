import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export interface UserData {
    email: string;
    password: string;
}

export interface IUser extends UserData, Document {
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    getSignedJwtToken: () => string;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please input your email'],
        },
        password: {
            type: String,
            required: [true, 'Please input your password'],
        },
    },
    { timestamps: true }
);

// hash user password before saving in database
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// match user password for login
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

// generate token to save in cookie for user login
UserSchema.methods.getSignedJwtToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const User = mongoose.model('User', UserSchema);

export default User;
