export interface Tour {
  id: string;
  thumbnailUrl: string;
  title: string;
  companyName: string;
  description: string;
  avgStar: number;
  totalRating: number;
  onlyFromCost: number;
  firstDestination?: {
    latitude: string;
    longitude: string;
  };
  isDeleted: boolean;
}

export type TourList = Tour[];

export enum TourSortBy {
  Recommended = "recommended",
  PriceAsc = "priceAsc",
  PriceDesc = "priceDesc",
}

/*--------------TourDetail-----------------------*/

export enum TicketKind {
  Adult = 0,
  Child = 1,
  PerGroupOfThree = 2,
  PerGroupOfFive = 3,
  PerGroupOfSeven = 4,
  PerGroupOfTen = 5,
}

export interface TicketType {
  id: string;
  defaultNetCost: number;
  minimumPurchaseQuantity: number;
  ticketKind: TicketKind;
  tourId: string;
}

export interface Rating {
  star: number;
  comment: string;
  createdAt: string;
}

export interface TourActivity {
  name: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
}

export interface TourDestination {
  name: string;
  imageUrls: string[];
  startTime: string;
  endTime: string;
  sortOrder: number;
  sortOrderByDate: number;
  latitude: string;
  longitude: string;
  activities: TourActivity[];
}

export interface TourDetail {
  tour: {
    id: string;
    title: string;
    companyName: string;
    description: string;
    avgStar: number;
    totalRating: number;
    about: string;
    onlyFromCost: number;
    pickinfor: string;
    include: string;
    imageUrls: string[];
    ticketTypes: TicketType[];
  };
  tourDestinations: TourDestination[];
}

//*--------------TourSchedule-----------------------*/

export interface TourScheduleDate {
  success: boolean;
  message: string;
  data: string[];
}

export interface TicketSchedule {
  ticketTypeId: string;
  ticketKind: TicketKind;
  netCost: number;
  availableTicket: number;
  tourScheduleId: string;
}

export interface DailyTicketSchedule {
  day: string;
  ticketSchedules: TicketSchedule[];
}

export interface TourScheduleTicket {
  success: boolean;
  message: string;
  data: DailyTicketSchedule[];
}

export interface FeedbackRequest {
  tourScheduleId: string;
  description: string;
}

export interface RatingRequest {
  tourId: string;
  bookingId: string;
  star: number;
  comment: string;
  images: string[];
}

export interface RatingResponse {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  userEmail: string;
  star: number;
  comment: string;
  images: string[];
}
