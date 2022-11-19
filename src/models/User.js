import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    firstname: { type: String, required: true, trim: true},
    lastname: { type: String, required: true, trim: true},
    yearOfBirth: {type: Number, required: true},
    gender: {type:String, required: true},
    address: { type: String, trim: true},
    roles:[{
        ref: 'Group',
        type: Schema.Types.ObjectId
    }], 
    systemRole:{
        ref: 'Role',
        type: Schema.Types.ObjectId
    }
},{
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

export default model("User", userSchema);