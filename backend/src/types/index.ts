import { Request } from "express";
import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  createdAt: Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "sales";
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}