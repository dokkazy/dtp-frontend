/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/http";
import { RatingRequest } from "@/types/tours";

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours, { next: { revalidate: 3600 } }),
  getOdataTour: (urlSearchParams?: { [key: string]: any }) =>
    http.get(
      `${apiEndpoint.odataTours}?${new URLSearchParams(urlSearchParams)}`,
      { cache: "no-store" },
    ),
  getById: (id: string) =>
    http.get(`${apiEndpoint.tours}/${id}`, { cache: "no-store" }),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`, { cache: "no-store" }),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`, { cache: "no-store" }),
  getRatingByTourId: (id: string) =>
    http.get(`${apiEndpoint.rating}/${id}`, { cache: "no-store" }),
  postRating: (body: RatingRequest) => http.post(apiEndpoint.rating, body),
  postFeedback: (body: { tourScheduleId: string; description: string }) =>
    http.post(apiEndpoint.feedback, body),

  //next server
  getAllTours: (urlSearchParams: string) =>
    http.get(`${nextServer.getAllTours}?${urlSearchParams}`, {
      baseUrl: "",
      cache: "no-store",
    }),

  getTourScheduleTicket: (id: string) =>
    http.get(`${nextServer.tourScheduleTicket}/${id}`, { baseUrl: "" }),

  getRecommendTours: () =>
    http.get(`${nextServer.recommendTours}`, {
      baseUrl: "",
      cache: "no-store",
    }),
};
