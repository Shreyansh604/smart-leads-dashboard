import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import LeadTable from "../components/LeadTable";
import LeadFilters from "../components/LeadFilters";
import LeadForm from "../components/LeadForm";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import api from "../api/axios";
import type { ILead, PaginationMeta, ILeadFilters } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";

const Dashboard = () => {
  const { isAdmin } = useAuth();

  const [leads, setLeads] = useState<ILead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState<ILead | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [filters, setFilters] = useState<ILeadFilters>({
    status: "",
    source: "",
    search: "",
    sort: "latest",
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.source && { source: filters.source }),
        ...(debouncedSearch && { search: debouncedSearch }),
        sort: filters.sort,
        page: filters.page,
        limit: 10,
      };
      const res = await api.get("/leads", { params });
      setLeads(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to fetch leads",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.status,
    filters.source,
    filters.sort,
    filters.page,
    debouncedSearch,
  ]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCreate = async (data: Partial<ILead>) => {
    setFormLoading(true);
    try {
      await api.post("/leads", data);
      setShowForm(false);
      showToast("Lead created successfully", "success");
      fetchLeads();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create lead",
        "error",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<ILead>) => {
    if (!editLead) return;
    setFormLoading(true);
    try {
      await api.put(`/leads/${editLead._id}`, data);
      setEditLead(null);
      showToast("Lead updated successfully", "success");
      fetchLeads();
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
    if (!deleteId) return;
    try {
      await api.delete(`/leads/${deleteId}`);
      showToast("Lead deleted successfully", "success");
      setDeleteId(null);
      fetchLeads();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete lead",
        "error",
      );
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/leads/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      showToast("CSV exported successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Export failed", "error");
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Leads</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your sales pipeline</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Lead
          </button>
        </div>

        {/* Filters */}
        <LeadFilters
          filters={filters}
          onChange={setFilters}
          onExport={handleExport}
          isAdmin={isAdmin}
        />

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-400">Loading leads...</p>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={(lead) => setEditLead(lead)}
            onDelete={(id) => setDeleteId(id)}
            isAdmin={isAdmin}
          />
        )}

        {/* Pagination */}
        {meta.total > 0 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <LeadForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {/* Edit Form */}
      {editLead && (
        <LeadForm
          onSubmit={handleUpdate}
          onClose={() => setEditLead(null)}
          initial={editLead}
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
      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this lead? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
