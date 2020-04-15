import { User } from './user';
import { Moment } from 'moment';

export interface CheckInOutResponse {
  checkIn: CheckInEntry[];
  checkOut: CheckOutEntry[];
}

export interface CheckInEntry {
  guest: User;
  nights: number;
  beds: number;
  checkInTime: Moment;
}

export interface CheckOutEntry {
  guest: User;
  nights: number;
  beds: number;
  checkOutTime: Moment;
}
