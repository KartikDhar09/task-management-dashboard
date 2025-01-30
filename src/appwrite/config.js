import { Client, Account, Databases, Query, ID } from 'appwrite';

// Initialize Appwrite client instance
const client = new Client();

const APPWRITE_API_KEY = import.meta.env.VITE_APPWRITE_API;

// Configure the client with Appwrite endpoint and project ID
client
    .setEndpoint('https://cloud.appwrite.io/v1')  
    .setProject(APPWRITE_API_KEY);                

const account = new Account(client);    // Initialize Account service for user authentication

const databases = new Databases(client); // Initialize Databases service for data operations

export { account, databases, ID, Query };