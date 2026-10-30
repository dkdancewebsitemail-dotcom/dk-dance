import dns from "dns";

try {
  if (typeof (dns as any).setDefaultResultOrder === "function") {
    (dns as any).setDefaultResultOrder("ipv4first");
  }
} catch { }

import { MongoClient, Db } from "mongodb";

const rawUri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB_NAME || "dkdancecompany";

interface GlobalWithMongo {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient> | null;
}

const globalWithMongo = global as unknown as GlobalWithMongo;

export function resetDbClient() {
  try {
    if (globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient.close().catch(() => { });
    }
  } catch { }
  globalWithMongo._mongoClient = undefined;
  globalWithMongo._mongoClientPromise = null;
}

const clientOptions = {
  maxPoolSize: 20,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
};

async function createClient(): Promise<MongoClient> {
  const client = new MongoClient(rawUri, clientOptions);
  return await client.connect();
}

async function getConnectedClient(): Promise<MongoClient | null> {
  if (!rawUri) {
    return null;
  }

  // If already connected client exists in global memory
  if (globalWithMongo._mongoClient) {
    return globalWithMongo._mongoClient;
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = createClient()
      .then((c) => {
        globalWithMongo._mongoClient = c;
        c.on("close", () => {
          resetDbClient();
        });
        c.on("error", () => {
          resetDbClient();
        });
        return c;
      })
      .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        resetDbClient();
        throw err;
      });
  }

  try {
    return await globalWithMongo._mongoClientPromise;
  } catch {
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  try {
    const client = await getConnectedClient();
    if (!client) {
      return null;
    }
    return client.db(dbName);
  } catch (error: any) {
    console.error("MongoDB getDb failed, resetting pool:", error?.message);
    resetDbClient();
    return null;
  }
}

export default getConnectedClient;
