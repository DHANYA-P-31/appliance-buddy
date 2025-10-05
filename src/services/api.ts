const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(errorData.error || 'Request failed', response.status);
  }
  return response.json();
}

export const api = {
  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return handleResponse(response);
  },

  // Appliances endpoints
  appliances: {
    getAll: async (params?: {
      search?: string;
      brand?: string;
      warrantyStatus?: string;
      page?: number;
      limit?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.brand) searchParams.set('brand', params.brand);
      if (params?.warrantyStatus) searchParams.set('warrantyStatus', params.warrantyStatus);
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      
      const url = `${API_BASE_URL}/appliances${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url);
      return handleResponse(response);
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/appliances/${id}`);
      return handleResponse(response);
    },

    create: async (data: any) => {
      // Serialize dates to ISO strings
      const serializedData = {
        ...data,
        purchaseDate: data.purchaseDate instanceof Date ? data.purchaseDate.toISOString() : data.purchaseDate,
        maintenanceTasks: data.maintenanceTasks?.map((task: any) => ({
          ...task,
          scheduledDate: task.scheduledDate instanceof Date ? task.scheduledDate.toISOString() : task.scheduledDate,
          completedDate: task.completedDate instanceof Date ? task.completedDate.toISOString() : task.completedDate,
        })) || [],
      };
      
      const response = await fetch(`${API_BASE_URL}/appliances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      // Serialize dates to ISO strings
      const serializedData = {
        ...data,
        purchaseDate: data.purchaseDate instanceof Date ? data.purchaseDate.toISOString() : data.purchaseDate,
        maintenanceTasks: data.maintenanceTasks?.map((task: any) => ({
          ...task,
          scheduledDate: task.scheduledDate instanceof Date ? task.scheduledDate.toISOString() : task.scheduledDate,
          completedDate: task.completedDate instanceof Date ? task.completedDate.toISOString() : task.completedDate,
        })) || [],
      };
      
      const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(errorData.error || 'Request failed', response.status);
      }
      return response.status === 204 ? true : handleResponse(response);
    },

    getWarrantyStatus: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/appliances/${id}/warranty`);
      return handleResponse(response);
    },
  },

  // Maintenance endpoints
  maintenance: {
    getByApplianceId: async (applianceId: string) => {
      const response = await fetch(`${API_BASE_URL}/maintenance/appliance/${applianceId}`);
      return handleResponse(response);
    },

    create: async (data: any) => {
      // Serialize dates to ISO strings
      const serializedData = {
        ...data,
        scheduledDate: data.scheduledDate instanceof Date ? data.scheduledDate.toISOString() : data.scheduledDate,
        completedDate: data.completedDate instanceof Date ? data.completedDate.toISOString() : data.completedDate,
      };
      
      const response = await fetch(`${API_BASE_URL}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      });
      return handleResponse(response);
    },

    update: async (id: string, data: any) => {
      // Serialize dates to ISO strings
      const serializedData = {
        ...data,
        scheduledDate: data.scheduledDate instanceof Date ? data.scheduledDate.toISOString() : data.scheduledDate,
        completedDate: data.completedDate instanceof Date ? data.completedDate.toISOString() : data.completedDate,
      };
      
      const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(errorData.error || 'Request failed', response.status);
      }
      return response.status === 204 ? true : handleResponse(response);
    },
  },
};

export { ApiError };