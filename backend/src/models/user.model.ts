import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "sales"], default: "sales" },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>("User", UserSchema);