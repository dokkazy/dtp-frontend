import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import type {
  CreateTourBodyType,
  DELETETourScheduleBodyType,
  POSTTourScheduleBodyType,
  PUTTourInfoBodyType,
  TourInfoFormBodyType,
  TourInfoResType,
  tourOdataResType,
  TourResType,
} from "@/schemaValidations/tour-operator.shema";
import { toast } from "sonner";
/**
 * Tour API service for handling tour-related API requests.
 */
const tourApiService = {
  getAll: async () => {
    try {
      const response = await http.get<TourResType>("/api/tour");
      return response;
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      throw error;
    }
  },

  getWithOData: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.odataTour}${queryParams ? queryParams + `` : "?$count=true"}`;
      const response = await http.get<tourOdataResType>(endpoint);
      return response;
    } catch (error) {
      console.error("Failed to fetch tours with OData:", error);
      throw error;
    }
  },

  getTourInfo: async (tourId: string) => {
    try {
      const response = await http.get<TourInfoResType>(
        `${apiEndpoint.tours}/tourinfor/${tourId}`,
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch tour info:", error);
      throw error;
    }
  },

  getTourDestination: async (tourId: string) => {
    const response = await http.get<TourInfoResType>(`${apiEndpoint.tourDestination}/${tourId}`)
    return response
  },
  getTourSchedule: async (tourId: string) => {
    const response = await http.get<TourInfoResType>(`${apiEndpoint.tourSchedule}/${tourId}`)
    return response
  },
  postTourSchedule: async (tourId: string, body: POSTTourScheduleBodyType) => {
    const response = await http.post(`${apiEndpoint.postTourSchedule}/${tourId}`, body)
    return response
  },

  deleteTourSchedule: async (tourId: string, body: DELETETourScheduleBodyType) => {
    const response = await http.delete(`${apiEndpoint.delTourSchedule}/${tourId}`, body)
    return response
  },

  create: async (body: CreateTourBodyType) => {
    try {
      const response = await http.post<TourResType>(
        `${apiEndpoint.tours}`,
        body,
      );
      return response;
    } catch (error) {
      console.error("Failed to create tour:", error);
      throw error;
    }
  },
  updateTourInfo: async (id: string, body: PUTTourInfoBodyType) =>
    http.put<PUTTourInfoBodyType>(`${apiEndpoint.tourInfo}/${id}`, body),

  delete: async (id: string) => {
    try {
      const response = await http.delete(`${apiEndpoint.tours}/${id}`, {
        errorMessage: "Failed to delete tour",
      });
      toast.success("Tour deleted successfully");
      return response;
    } catch (error) {
      console.error("Failed to delete tour:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await http.get<TourResType>(
        `${apiEndpoint.tours}/${id}`,
        {
          errorMessage: "Failed to fetch tour details",
        },
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch tour by ID:", error);
      throw error;
    }
  },
};

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours),
  getById: (id: string) => http.get(`${apiEndpoint.tours}/${id}`),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`),
};

export default tourApiService;
