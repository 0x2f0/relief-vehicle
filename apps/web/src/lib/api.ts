import {
	Application,
	PublicStats,
	RoadCondition,
	AuditLog,
	Pass,
	CheckpointScan,
	CoordinationDashboardData,
} from "./types";
import { clearAuthStorage, getAuthToken } from "./authStorage";

const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";
const BASE_URL = RAW_API_URL ? RAW_API_URL.replace(/\/$/, "") : "/api";

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const token = getAuthToken();
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>),
	};

	if (token && !headers["Authorization"]) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = cleanEndpoint.startsWith("http") ? cleanEndpoint : `${BASE_URL}${cleanEndpoint}`;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 7000);

	try {
		const response = await fetch(url, {
			...options,
			headers,
			signal: options.signal || controller.signal,
		});

		if (response.status === 401 && !cleanEndpoint.includes("/auth/login")) {
			clearAuthStorage();
		}

		if (!response.ok) {
			const errorBody = await response.json().catch(() => ({}));
			const message = (errorBody as any).error || (errorBody as any).message || response.statusText;
			throw new Error(message || "Request failed");
		}

		return await response.json();
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function submitApplication(data: Record<string, any>) {
	return fetchApi<{ id: string; secret_token: string; priority: string; message: string }>(
		"/applications",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
}

export async function trackApplication(id: string, token?: string) {
	const query = token ? `?token=${encodeURIComponent(token)}` : "";
	const data = await fetchApi<{ application: Application }>(
		`/applications/${encodeURIComponent(id)}/track${query}`,
	);
	return data.application;
}

export async function getPublicPass(id: string) {
	return fetchApi<{ pass: Pass; application?: Application }>(
		`/passes/${encodeURIComponent(id)}/public`,
	);
}

export async function getPublicStats(): Promise<PublicStats> {
	try {
		const res = await fetchApi<any>("/public/stats");
		return {
			activePasses: Number(res.activePasses ?? res.total_active_passes ?? 0),
			approvedApplications: Number(
				res.approvedApplications ?? res.total_approved ?? res.total_applications ?? 0,
			),
			roadUpdates: Number(res.roadUpdates ?? res.total_roads ?? 0),
			checkpointScans: Number(res.checkpointScans ?? res.total_scans ?? 0),
		};
	} catch {
		return {
			activePasses: 0,
			approvedApplications: 0,
			roadUpdates: 0,
			checkpointScans: 0,
		};
	}
}

export async function getRoads(): Promise<RoadCondition[]> {
	try {
		const res = await fetchApi<{ roads: RoadCondition[] }>("/roads");
		return res.roads || [];
	} catch {
		return [];
	}
}

export async function addRoadCondition(data: {
	road_name: string;
	status: string;
	description: string;
}) {
	return fetchApi<{ id: string; message: string }>("/admin/roads", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function deleteRoadCondition(id: string) {
	return fetchApi<{ message: string }>(`/admin/roads/${id}`, {
		method: "DELETE",
	});
}

export async function verifyScan(qr_token: string) {
	return fetchApi<{
		status: "VALID" | "INVALID" | "REVOKED" | "EXPIRED";
		pass?: Pass;
		message?: string;
	}>("/verify/scan", {
		method: "POST",
		body: JSON.stringify({ qr_token }),
	});
}

export async function recordCheckpointScan(data: Partial<CheckpointScan>) {
	return fetchApi<{ message: string; id: string }>("/verify/record", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function adminLogin(username: string, password: string) {
	return fetchApi<{ token: string; user?: { id: string; username: string; role: string } }>(
		"/auth/login",
		{
			method: "POST",
			body: JSON.stringify({ username, password }),
		},
	);
}

export async function getAdminApplications(status?: string): Promise<Application[]> {
	const query = status ? `?status=${encodeURIComponent(status)}` : "";
	const res = await fetchApi<{ applications: Application[] }>(`/admin/applications${query}`);
	return res.applications || [];
}

export async function getAdminApplication(id: string): Promise<Application> {
	const res = await fetchApi<{ application: Application }>(`/admin/applications/${id}`);
	return res.application;
}

export async function updateApplicationStatus(id: string, status: string, admin_notes?: string) {
	return fetchApi<{ message: string }>(`/admin/applications/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status, admin_notes }),
	});
}

export async function issuePass(data: {
	application_id: string;
	valid_from: string;
	valid_until: string;
	approved_route: string;
}) {
	return fetchApi<{ id: string; message: string }>("/admin/passes/issue", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function revokePass(passId: string, revocation_reason: string) {
	return fetchApi<{ message: string }>(`/admin/passes/${passId}/revoke`, {
		method: "POST",
		body: JSON.stringify({ revocation_reason }),
	});
}

export async function holdApplication(id: string, admin_notes?: string) {
	return fetchApi<{ message: string }>(`/admin/applications/${id}/hold`, {
		method: "PATCH",
		body: JSON.stringify({ admin_notes }),
	});
}

export async function requestApplicationInfo(id: string, info_request_reason: string) {
	return fetchApi<{ message: string }>(`/admin/applications/${id}/request-info`, {
		method: "PATCH",
		body: JSON.stringify({ info_request_reason }),
	});
}

export async function getCheckpoints(): Promise<any[]> {
	try {
		const res = await fetchApi<{ checkpoints: any[] }>("/admin/checkpoints");
		return res.checkpoints || [];
	} catch {
		return [];
	}
}

export async function addCheckpoint(data: {
	name: string;
	location: string;
	district?: string;
	highway?: string;
}) {
	return fetchApi<{ id: string; message: string }>("/admin/checkpoints", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function deleteCheckpoint(id: string) {
	return fetchApi<{ message: string }>(`/admin/checkpoints/${id}`, {
		method: "DELETE",
	});
}

export async function getAdminUsers(): Promise<any[]> {
	try {
		const res = await fetchApi<{ users: any[] }>("/admin/users");
		return res.users || [];
	} catch {
		return [];
	}
}

export async function addAdminUser(data: {
	username: string;
	password: string;
	role: string;
	full_name?: string;
	checkpoint_name?: string;
	badge_number?: string;
	phone?: string;
}) {
	return fetchApi<{ id: string; message: string }>("/admin/users", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function deleteAdminUser(id: string) {
	return fetchApi<{ message: string }>(`/admin/users/${id}`, {
		method: "DELETE",
	});
}

export const api = {
	getMe: async () => {
		const res = await fetchApi<{
			user: {
				id: string;
				username: string;
				role: string;
				district?: string;
				full_name?: string;
				checkpoint_name?: string;
				badge_number?: string;
				phone?: string;
			};
		}>("/auth/me");
		return res.user;
	},
	getAuditLogs: async (params?: {
		entity_type?: string;
		search?: string;
		limit?: number;
		offset?: number;
	}) => {
		const query = new URLSearchParams();
		if (params?.entity_type) query.set("entity_type", params.entity_type);
		if (params?.search) query.set("search", params.search);
		if (params?.limit) query.set("limit", String(params.limit));
		if (params?.offset) query.set("offset", String(params.offset));
		const qs = query.toString();
		return fetchApi<{ logs: AuditLog[] }>(`/admin/audit-logs${qs ? `?${qs}` : ""}`);
	},
	getCoordinationDashboard: async (): Promise<CoordinationDashboardData> => {
		return fetchApi<CoordinationDashboardData>("/admin/coordination");
	},
};
