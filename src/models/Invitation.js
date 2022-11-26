import {Schema, model} from 'mongoose';

const invitationSchema = new Schema({
  groupId: String,
}, {
  timestamps: true,
  versionKey: false,
})

export default model("Invitation", invitationSchema)