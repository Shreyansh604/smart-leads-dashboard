import { useNavigate } from "react-router-dom";
import type { ILead } from "../types";

interface Props {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const STATUS_COLORS: Record<ILead["status"], string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const LeadTable = ({ leads, onEdit, onDelete, isAdmin }: Props) => {
  const navigate = useNavigate();

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-400 text-lg">No leads found</p>
        <p className="text-gray-300 dark:text-gray-500 text-sm mt-1">
          Try adjusting your filters or create a new lead
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              {["Name","Email","Status","Source","Created","Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td
                  className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{lead.source}</td>
                <td className="px-6 py-4 text-gray-400 dark:text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition font-medium"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="font-medium text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  {lead.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{lead.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                {lead.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{lead.source}</span>
              <span>•</span>
              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => onEdit(lead)}
                className="flex-1 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                Edit
              </button>
              {isAdmin && (
                <button
                  onClick={() => onDelete(lead._id)}
                  className="flex-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeadTable;