/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours),
  getOdataTour: (urlSearchParams?: { [key: string]: any }) =>
    http.get(`${apiEndpoint.odataTours}?${new URLSearchParams(urlSearchParams)}`),
  getById: (id: string) => http.get(`${apiEndpoint.tours}/${id}`),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`),
};
