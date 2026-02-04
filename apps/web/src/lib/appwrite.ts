import { Client, Databases, Account } from 'appwrite';

// Appwrite Client Configuration
const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Services
export const databases = new Databases(client);
export const account = new Account(client);

// Export client for Realtime subscriptions
export { client };

// Constants
export const APPWRITE_CONFIG = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'etheria_game',
    collections: {
        chatMessages: process.env.NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID || 'chat_messages',
    }
};
