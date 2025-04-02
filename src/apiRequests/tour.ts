/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/http";

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours),
  getOdataTour: (urlSearchParams?: { [key: string]: any }) =>
    http.get(
      `${apiEndpoint.odataTours}?${new URLSearchParams(urlSearchParams)}`,
      { next: { revalidate: 3600 } },
    ),
  getById: (id: string) =>
    http.get(`${apiEndpoint.tours}/${id}`, { next: { revalidate: 1300 } }),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`, {
      next: { revalidate: 1300 },
    }),

  //next server
  getAllTours: (urlSearchParams: string) =>
    http.get(`${nextServer.getAllTours}?${urlSearchParams}`, { baseUrl: "" }),
  
  getTourScheduleTicket: (id: string) =>
    http.get(`${nextServer.tourScheduleTicket}/${id}`, { baseUrl: "" }),
};
