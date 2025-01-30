import { Client, Account, Databases, Query, ID } from 'appwrite';
const client = new Client();
const APPWRITE_API_KEY = import.meta.env.VITE_APPWRITE_API;

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(APPWRITE_API_KEY);
    

 const account = new Account(client);
 const databases = new Databases(client);

// export const account = new Account(client);
export { account, databases, ID, Query };

