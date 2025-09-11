import { MongoClient, Db, Collection } from "mongodb";
import type { Room } from "./types";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "aoce";

// Reuse client across hot reloads
let _client: MongoClient | null = null;
let _db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!_client) {
    if (!uri) throw new Error("MONGODB_URI manquant");
    _client = new MongoClient(uri);
    await _client.connect();
    _db = _client.db(dbName);
  }
  return _db!;
}

export async function roomsCol(): Promise<Collection<Room>> {
  const db = await getDb();
  return db.collection<Room>("rooms");
}

// Crée l'index TTL si absent
let _ttlEnsured = false;
export async function ensureTTLIndex() {
  if (_ttlEnsured) return;
  const col = await roomsCol();
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  _ttlEnsured = true;
}
