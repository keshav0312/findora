import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  conversationId: string; // deterministic id: [lostItemId,foundItemId] pair or userA_userB
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  matchId?: mongoose.Types.ObjectId;
  text: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matchId: { type: Schema.Types.ObjectId, ref: "Match" },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
