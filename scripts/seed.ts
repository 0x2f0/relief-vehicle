import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

function normalizeDbUrl(rawUrl?: string): string {
	let url = (rawUrl || "").trim();
	if (!url) return "file:local.db";
	if (url.startsWith("turso://")) {
		url = url.replace(/^turso:\/\//, "libsql://");
	} else if (url.startsWith("turso:")) {
		url = url.replace(/^turso:/, "libsql:");
	}
	return url;
}

let dbUrl = normalizeDbUrl(process.env.TURSO_URL || process.env.TURSO_DATABASE_URL);
let dbToken = (process.env.TURSO_AUTH_TOKEN || "").trim();

if ((dbUrl.startsWith("libsql:") || dbUrl.startsWith("https:")) && !dbToken) {
	console.warn(
		`[DB] Remote database URL provided without TURSO_AUTH_TOKEN. Falling back to local database (file:local.db).`,
	);
	dbUrl = "file:local.db";
}

function hexToBytes(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function hashPassword(password: string, saltHex?: string): Promise<string> {
	const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
	const enc = new TextEncoder().encode(password);

	const keyMaterial = await crypto.subtle.importKey("raw", enc, { name: "PBKDF2" }, false, [
		"deriveBits",
		"deriveKey",
	]);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: toArrayBuffer(salt),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);

	const derivedHex = Array.from(new Uint8Array(derivedBits))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	const saltOut = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `pbkdf2$100000$${saltOut}$${derivedHex}`;
}

async function seed() {
	let activeDb = createClient({ url: dbUrl, authToken: dbToken });
	console.log(`Starting database seed against ${dbUrl}...`);

	try {
		// Test connection
		try {
			await activeDb.execute("SELECT 1");
		} catch (connErr: any) {
			if (dbUrl !== "file:local.db") {
				console.warn(
					`[DB] Connection to ${dbUrl} failed (${connErr.message}). Falling back to local database (file:local.db)...`,
				);
				dbUrl = "file:local.db";
				activeDb = createClient({ url: "file:local.db" });
				await activeDb.execute("SELECT 1");
			} else {
				throw connErr;
			}
		}

		const now = new Date().toISOString();

		// Environment-driven or fallback initial account credentials
		const adminPassword = process.env.ADMIN_PASSWORD || "N30c#M4st3r$9xK7#vQ2@2026!zL";

		// High-Entropy Production & Duty Accounts
		const users = [
			{
				id: randomUUID(),
				username: "admin",
				rawPassword: adminPassword,
				role: "superadmin",
			},
		];

		for (const u of users) {
			const passwordHash = await hashPassword(u.rawPassword);
			await activeDb.execute({
				sql: `INSERT INTO users (id, username, password_hash, role, created_at)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role`,
				args: [u.id, u.username, passwordHash, u.role, now],
			});
		}

		console.log("Seed completed successfully. Users provisioned.");
	} catch (error) {
		console.error("Seed failed:", error);
		process.exit(1);
	}
}

seed();
