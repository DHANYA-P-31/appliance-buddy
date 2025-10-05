import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Transform API response to match frontend Appliance type
const transformApiAppliance = (apiAppliance: any): Appliance => ({
  ...apiAppliance,
  purchaseDate: new Date(apiAppliance.purchaseDate),
  maintenanceTasks: apiAppliance.maintenanceTasks?.map((task: any) => ({
    ...task,
    scheduledDate: new Date(task.scheduledDate),
    completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
  })) || [],
  supportContacts: apiAppliance.supportContacts || [],
  linkedDocuments: apiAppliance.linkedDocuments || [],
});

export const useAppliances = () => {
  const queryClient = useQueryClient();

  // Fetch all appliances
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
=======
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Transform API response to match frontend Appliance type
const transformApiAppliance = (apiAppliance: any): Appliance => ({
  ...apiAppliance,
  purchaseDate: new Date(apiAppliance.purchaseDate),
  maintenanceTasks: apiAppliance.maintenanceTasks?.map((task: any) => ({
    ...task,
    scheduledDate: new Date(task.scheduledDate),
    completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
  })) || [],
  supportContacts: apiAppliance.supportContacts || [],
  linkedDocuments: apiAppliance.linkedDocuments || [],
});

export const useAppliances = () => {
  const queryClient = useQueryClient();

  // Fetch all appliances
  const {
    data: appliancesResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['appliances'],
    queryFn: () => api.appliances.getAll({ limit: 100 }), // Get all appliances
    retry: 3,
    retryDelay: 1000,
  });

  const appliances = appliancesResponse?.data?.map(transformApiAppliance) || [];

  // Add appliance mutation
  const addApplianceMutation = useMutation({
    mutationFn: (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => 
      api.appliances.create(appliance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: 'Success',
        description: 'Appliance added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add appliance',
        variant: 'destructive',
      });
    },
  });

  // Update appliance mutation
  const updateApplianceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Appliance> }) => 
      api.appliances.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: 'Success',
        description: 'Appliance updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appliance',
        variant: 'destructive',
      });
    },
  });

  // Delete appliance mutation
  const deleteApplianceMutation = useMutation({
    mutationFn: (id: string) => api.appliances.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliances'] });
      toast({
        title: 'Success',
        description: 'Appliance deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete appliance',
        variant: 'destructive',
      });
    },
  });

  const addAppliance = (appliance: Omit<Appliance, 'id' | 'supportContacts' | 'maintenanceTasks' | 'linkedDocuments'>) => {
    addApplianceMutation.mutate(appliance);
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    updateApplianceMutation.mutate({ id, updates });
  };

  const deleteAppliance = (id: string) => {
    deleteApplianceMutation.mutate(id);
  };

  const resetToSampleData = () => {
    // This functionality isn't needed with API backend
    // The backend already has seeded data
    toast({
      title: 'Info',
      description: 'Data is managed by the database. Use the backend seed command to reset data.',
    });
>>>>>>> 9f3c47567f12c28262bf13de620e1e34a15f5f06
  };

  return {
    appliances,
<<<<<<< HEAD
    loading,
=======
    loading: loading || addApplianceMutation.isPending || updateApplianceMutation.isPending || deleteApplianceMutation.isPending,
>>>>>>> 9f3c47567f12c28262bf13de620e1e34a15f5f06
    error,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    resetToSampleData,
<<<<<<< HEAD
    refetch: fetchAppliances
=======
>>>>>>> 9f3c47567f12c28262bf13de620e1e34a15f5f06
  };
};