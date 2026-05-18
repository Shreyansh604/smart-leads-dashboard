export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdAt: string;
  createdBy: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ILeadFilters {
  status: string;
  source: string;
  search: string;
  sort: string;
  page: number;
}

export interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  isAdmin: boolean;
}