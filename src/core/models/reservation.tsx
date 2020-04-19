import { RoomPhoto } from './room';
import { User } from './user';

export interface ReservationPayload {
  checkIn: string;
  checkOut: string;
  rooms: { id: number; guests: number }[];
  specialRequests: string;
}

export interface ReservationResponse {
  id: string;
  checkIn: string;
  checkOut: string;
  rooms: { id: number; type: string; guests: number }[];
  specialRequests: string;
}

export type ReservationStatusResponse = {
  checkIn: Date;
  checkOut: Date;
  rooms: { beds: { id: number; room_id: number }[] } & Reservation['rooms'];
} & Reservation;

export interface ReservationPaymentStatusResponse {
  isPaid: boolean;
}
export interface Reservation {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guest: User;
  rooms: {
    id: number;
    price: number;
    description: string;
    type: string;
    guests: number;
    beds: { id: number; room_id: number }[];
    photos: RoomPhoto[];
  }[];
  specialRequests: string;
  isPaid: boolean;
}
