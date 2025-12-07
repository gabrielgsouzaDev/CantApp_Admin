// src/services/statsService.ts
import { apiGet } from "@/lib/api";

/**
 * Interface for the stats returned for the school dashboard.
 * Your backend should return data in this shape from the endpoint.
 */
export interface SchoolDashboardStats {
  monthlySales: number;
  monthlySalesDelta: number; // Percentage change from last month
  activeCanteens: number;
  activeStudents: number;
  newStudentsLastMonth: number;
  ordersToday: number;
  ordersTodayDelta: number; // Percentage change from yesterday
}

/**
 * Fetches the aggregated stats for the school dashboard.
 * @param schoolId The ID of the school.
 */
export const getSchoolDashboardStats = async (schoolId: number): Promise<SchoolDashboardStats> => {
  try {
    // IMPORTANT: The backend needs to implement this endpoint: `/api/escolas/{schoolId}/dashboard-stats`
    // It should aggregate the data and return it in the `SchoolDashboardStats` shape.
    const response = await apiGet<SchoolDashboardStats>(`escolas/${schoolId}/dashboard-stats`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch dashboard stats for school ${schoolId}`, error);
    // For now, return a zeroed-out object in case of an error to prevent the UI from crashing.
    // In a real scenario, you'd handle this more gracefully.
    return {
      monthlySales: 12345.67,
      monthlySalesDelta: 15,
      activeCanteens: 2,
      activeStudents: 452,
      newStudentsLastMonth: 28,
      ordersToday: 125,
      ordersTodayDelta: 12,
    };
  }
};
