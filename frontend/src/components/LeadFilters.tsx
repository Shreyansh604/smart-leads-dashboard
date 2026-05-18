import type { ILeadFilters } from "../types";

interface Props {
  filters: ILeadFilters;
  onChange: (filters: ILeadFilters) => void;
  onExport: () => void;
  isAdmin: boolean;
}

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Lost"];
const SOURCE_OPTIONS = ["Website", "Instagram", "Referral"];

const LeadFilters = ({ filters, onChange, onExport, isAdmin }: Props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search name or email..."
          className="w-full sm:w-56 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        {isAdmin && (
          <button
            onClick={onExport}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-medium"
          >
            Export CSV
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;