const BASE_URL = 'http://localhost:8084/api/v1/bff/web/pets';

export type AgeCategory = 'joven' | 'adulto' | 'viejo';

export type PetStatus = 'extraviado' | 'encontrado';

export interface PetType {
  id: string;
  name_type: string;
  breed: string;
}

export interface CreatePetReportDTO {
  name: string;
  age_category: AgeCategory;
  type_id: string;
  user_id: string;
  last_seen_location: string;
  last_seen_date: string;
  color: string;
  description: string;
  status: PetStatus;
}

export interface PetReport {
  id: string;
  name: string;
  age_category: AgeCategory;
  type_id: PetType;
  user_id: string;
  last_seen_location: string;
  last_seen_date: string;
  color: string;
  description: string;
  status: PetStatus;
}

export const petsService = {
  create: async (petData: CreatePetReportDTO): Promise<PetReport> => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error(`BFF error creating report: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in petsService.create:', error);
      throw error;
    }
  },

  getAll: async (): Promise<PetReport[]> => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Error fetching reports');
      return await response.json();
    } catch (error) {
      console.error('Error in petsService.getAll:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PetReport> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Report not found');
      return await response.json();
    } catch (error) {
      console.error(`Error in petsService.getById(${id}):`, error);
      throw error;
    }
  },

  update: async (id: string, petData: Partial<CreatePetReportDTO>): Promise<PetReport> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error('Error updating report');
      return await response.json();
    } catch (error) {
      console.error(`Error in petsService.update(${id}):`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting report');
    } catch (error) {
      console.error(`Error in petsService.delete(${id}):`, error);
      throw error;
    }
  }
};