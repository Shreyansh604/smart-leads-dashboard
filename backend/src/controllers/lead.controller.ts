import { NextFunction, Response } from "express";
import Lead from "../models/lead.model";
import { AuthRequest, PaginationMeta } from "../types";
import { Parser } from "@json2csv/plainjs";

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.create({ name, email, status, source, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort, page = "1", limit = "10" } = req.query;

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === "oldest" ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum),
      Lead.countDocuments(query),
    ]);

    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };

    res.status(200).json({ success: true, data: leads, meta });
  } catch(error) {
    console.error("getLeads error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leads = await Lead.find({});
    const parser = new Parser({ fields: ["name", "email", "status", "source", "createdAt"] });
    const csv = parser.parse(leads);
    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};