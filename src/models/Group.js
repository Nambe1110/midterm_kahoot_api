import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: {type:String, required:true, unique:true},
    image: {type:String},
    owner_id: {type:Schema.Types.ObjectId, required:true, ref:'User'},
    co_owner_id: [{type: Schema.Types.ObjectId, ref:'User'}],
    member_id:  [{type: Schema.Types.ObjectId, ref:'User'}],
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('Group', groupSchema);