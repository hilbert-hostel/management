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
  record: Record;
}

export interface Record {
  idCardData: {
    address: string;
    birthdate: Date;
    expireDate: Date;
    gender: string;
    idCardPhoto: string;
    issueDate: Date;
    issuer: string;
    nameEN: string;
    nameTH: string;
    nationalID: string;
    photo: string;
  };
  photo: string;
}

export interface CheckOutEntry {
  guest: User;
  nights: number;
  beds: number;
  checkOutTime: Moment;
}
