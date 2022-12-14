import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    tokenType: {
        type: String,
        default: "activateAccount"
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    }
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;