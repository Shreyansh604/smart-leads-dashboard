import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { ILead } from "../types";
import LeadForm from "../components/LeadForm";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const STATUS_COLORS: Record<ILead["status"], string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [lead, setLead] = useState<ILead | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data.data);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to fetch lead",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleUpdate = async (data: Partial<ILead>) => {
    setFormLoading(true);
    try {
      const res = await api.put(`/leads/${id}`, data);
      setLead(res.data.data);
      setShowEdit(false);
      showToast("Lead updated successfully", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update lead",
        "error",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${id}`);
      navigate("/dashboard");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete lead",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading lead details...</p>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-gray-400 text-lg">Lead not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Lead Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {lead.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {lead.email}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[lead.status]}`}
            >
              {lead.status}
            </span>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Source
              </p>
              <p className="text-gray-800 font-medium">{lead.source}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Status
              </p>
              <p className="text-gray-800 font-medium">{lead.status}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Created At
              </p>
              <p className="text-gray-800 font-medium">
                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium mb-1">
                Lead ID
              </p>
              <p className="text-gray-800 dark:text-gray-100 font-medium">
                {lead._id}
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowEdit(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Edit Lead
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition font-medium"
              >
                Delete Lead
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {showEdit && (
        <LeadForm
          onSubmit={handleUpdate}
          onClose={() => setShowEdit(false)}
          initial={lead}
          loading={formLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Delete Confirm Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this lead? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </Layout>
  );
};

export default LeadDetail;
