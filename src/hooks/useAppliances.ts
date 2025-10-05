import { useState, useEffect } from 'react';
import { Appliance } from '@/types/appliance';
import { getMaintenanceStatus } from '@/utils/dateUtils';
import { generateMockAppliances } from '@/data/mockAppliances';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API service class
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Appliances API methods
  async getAppliances(): Promise<Appliance[]> {
    return this.request<Appliance[]>('/appliances');
  }

  async getAppliance(id: string): Promise<Appliance> {
    return this.request<Appliance>(`/appliances/${id}`);
  }

  async createAppliance(data: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>): Promise<Appliance> {
    return this.request<Appliance>('/appliances', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        purchaseDate: data.purchaseDate.toISOString(),
      }),
    });
  }

  async updateAppliance(id: string, data: Partial<Appliance>): Promise<Appliance> {
    const updateData = { ...data };
    if (updateData.purchaseDate) {
      updateData.purchaseDate = new Date(updateData.purchaseDate).toISOString() as any;
    }
    
    return this.request<Appliance>(`/appliances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteAppliance(id: string): Promise<void> {
    await this.request<void>(`/appliances/${id}`, {
      method: 'DELETE',
    });
  }

  async getApplianceStats(): Promise<{ total: number; active: number; expiring: number; expired: number }> {
    return this.request<{ total: number; active: number; expiring: number; expired: number }>('/appliances/stats');
  }
}

const apiService = new ApiService();

export const useAppliances = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppliances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAppliances();
      
      // Transform the data to match expected format
      const transformedData = data.map((app: any) => ({
        ...app,
        purchaseDate: new Date(app.purchaseDate),
        maintenanceTasks: app.maintenanceTasks?.map((task: any) => ({
          ...task,
          scheduledDate: new Date(task.scheduledDate),
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
          status: getMaintenanceStatus(new Date(task.scheduledDate), task.completedDate ? new Date(task.completedDate) : undefined)
        })) || [],
        supportContacts: app.supportContacts || [],
        linkedDocuments: app.linkedDocuments || []
      }));
      
      setAppliances(transformedData);
    } catch (err) {
      console.error('Failed to fetch appliances:', err);
      console.error('API URL:', API_BASE_URL);
      console.error('Full error details:', JSON.stringify(err, null, 2));
      setError(`Failed to load appliances: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
      
      // Fallback to mock data in case of API failure
      console.log('Falling back to mock data...');
      setAppliances(generateMockAppliances());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const addAppliance = async (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => {
    try {
      const newAppliance = await apiService.createAppliance(appliance);
      const transformedAppliance = {
        ...newAppliance,
        purchaseDate: new Date(newAppliance.purchaseDate),
        supportContacts: [],
        maintenanceTasks: [],
        linkedDocuments: []
      };
      setAppliances(prev => [...prev, transformedAppliance]);
    } catch (err) {
      console.error('Failed to create appliance:', err);
      setError('Failed to create appliance. Please try again.');
      throw err;
    }
  };

  const updateAppliance = async (id: string, updates: Partial<Appliance>) => {
    try {
      const updatedAppliance = await apiService.updateAppliance(id, updates);
      const transformedAppliance = {
        ...updatedAppliance,
        purchaseDate: new Date(updatedAppliance.purchaseDate),
        maintenanceTasks: updatedAppliance.maintenanceTasks?.map((task: any) => ({
          ...task,
          scheduledDate: new Date(task.scheduledDate),
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        })) || [],
      };
      
      setAppliances(prev => prev.map(app => 
        app.id === id ? { ...app, ...transformedAppliance } : app
      ));
    } catch (err) {
      console.error('Failed to update appliance:', err);
      setError('Failed to update appliance. Please try again.');
      throw err;
    }
  };

  const deleteAppliance = async (id: string) => {
    try {
      await apiService.deleteAppliance(id);
      setAppliances(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Failed to delete appliance:', err);
      setError('Failed to delete appliance. Please try again.');
      throw err;
    }
  };

  const resetToSampleData = async () => {
    // For now, just refetch from API which should have sample data
    await fetchAppliances();
  };

  return {
    appliances,
    loading,
    error,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    resetToSampleData,
    refetch: fetchAppliances
  };
};