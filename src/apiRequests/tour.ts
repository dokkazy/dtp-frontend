/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/http";

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours),
  getOdataTour: (urlSearchParams?: { [key: string]: any }) =>
    http.get(
      `${apiEndpoint.odataTours}?${new URLSearchParams(urlSearchParams)}`,
    ),
  getTourCount: () => http.get(`${apiEndpoint.odataTour}/$count`),
  getById: (id: string) => http.get(`${apiEndpoint.tours}/${id}`),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`),

  //next server
  getAllTours: (urlSearchParams: string) =>
    http.get(`${nextServer.getAllTours}?${urlSearchParams}`, { baseUrl: "" }),

  getTourScheduleTicket: (id: string) =>
    http.get(`${nextServer.tourScheduleTicket}/${id}`, { baseUrl: "" }),

  getRecommendTours: () =>
    http.get(`${nextServer.recommendTours}`, {
      baseUrl: "",
    }),
};
