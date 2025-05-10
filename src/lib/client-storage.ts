'use client';

import type { Client } from './types';

const CLIENTS_STORAGE_KEY = 'invoiceAI_clients';

export const getClientsFromStorage = (): Client[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedData = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error getting clients from localStorage:", error);
    return [];
  }
};

export const getClientByIdFromStorage = (clientId: string): Client | undefined => {
  if (typeof window === 'undefined') return undefined;
  const clients = getClientsFromStorage();
  return clients.find(client => client.id === clientId);
};

export const saveClientToStorage = (client: Client): Client[] => {
  if (typeof window === 'undefined') return [];
  try {
    const existingClients = getClientsFromStorage();
    const clientIndex = existingClients.findIndex(c => c.id === client.id);

    let updatedClients;
    if (clientIndex > -1) {
      // Update existing client
      updatedClients = existingClients.map((c, index) => index === clientIndex ? client : c);
    } else {
      // Add new client
      updatedClients = [...existingClients, client];
    }
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
    return updatedClients;
  } catch (error) {
    console.error("Error saving client to localStorage:", error);
    return getClientsFromStorage(); // return current state on error
  }
};

export const addClientToStorage = (client: Omit<Client, 'id'>): Client => {
  if (typeof window === 'undefined') throw new Error("localStorage not available");
  const newClient: Client = { ...client, id: crypto.randomUUID() };
  saveClientToStorage(newClient);
  return newClient;
};


export const updateClientInStorage = (updatedClient: Client): Client[] => {
  if (typeof window === 'undefined') return [];
  return saveClientToStorage(updatedClient);
};

export const deleteClientFromStorage = (clientId: string): Client[] => {
  if (typeof window === 'undefined') return [];
  try {
    const existingClients = getClientsFromStorage();
    const updatedClients = existingClients.filter(client => client.id !== clientId);
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
    return updatedClients;
  } catch (error) {
    console.error("Error deleting client from localStorage:", error);
    return getClientsFromStorage(); // return current state on error
  }
};
