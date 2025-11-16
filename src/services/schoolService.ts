import { api } from "@/lib/api";
import { mockSchools } from "@/lib/mocks";
import { School } from "@/lib/types";

// For demo purposes, we'll use a mock latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getSchools = async (): Promise<School[]> => {
  console.log("Fetching schools from API...");
  // REAL: return api.get<School[]>('/schools');
  await sleep(500); // Simulate network delay
  return Promise.resolve(mockSchools);
};

export const addSchool = async (school: Omit<School, 'id'>): Promise<School> => {
  console.log("Adding school via API:", school);
  // REAL: return api.post<School>('/schools', school);
  await sleep(500);
  const newSchool: School = { id: Math.random(), ...school };
  mockSchools.push(newSchool);
  return Promise.resolve(newSchool);
};

export const updateSchool = async (id: number, school: Partial<Omit<School, 'id' | 'ownerUid'>>): Promise<School> => {
  console.log(`Updating school ${id} via API with:`, school);
  // REAL: return api.put<School>(`/schools/${id}`, school);
  await sleep(500);
  const index = mockSchools.findIndex(s => s.id === id);
  if (index > -1) {
    mockSchools[index] = { ...mockSchools[index], ...school };
    return Promise.resolve(mockSchools[index]);
  }
  throw new Error("School not found");
};

export const deleteSchool = async (id: number): Promise<void> => {
  console.log(`Deleting school ${id} via API`);
  // REAL: return api.delete<void>(`/schools/${id}`);
  await sleep(500);
  const index = mockSchools.findIndex(s => s.id === id);
  if (index > -1) {
    mockSchools.splice(index, 1);
    return Promise.resolve();
  }
  throw new Error("School not found");
};
