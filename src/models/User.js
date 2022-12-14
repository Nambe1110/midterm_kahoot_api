import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    firstname: { type: String, required: true, trim: true},
    lastname: { type: String, required: true, trim: true},
    yearOfBirth: {type: Number},
    unread_count: {type: Number},
    address: { type: String, trim: true},
    avatar: {type:String, default: 'https://shop.phuongdonghuyenbi.vn/wp-content/uploads/avatars/1510/default-avatar-bpthumb.png'},
    roles:{
        owner:[{
            ref: 'Group',
            type: Schema.Types.ObjectId
        }],
        co_owner:[{
            ref: 'Group',
            type: Schema.Types.ObjectId
        }],
        member:[{
            ref: 'Group',
            type: Schema.Types.ObjectId
        }]
    }, 
    systemRole:{
        ref: 'Role',
        type: Schema.Types.ObjectId
    },
    isActivated: { type:Boolean, required: true, default: false}
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