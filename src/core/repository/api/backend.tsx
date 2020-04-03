import { AxiosClient } from './axios';
import { RegistrationModel } from '../../models/registration';
import { AuthPayload, LoginModel } from '../../models/auth';
import { RoomSearchPayload } from '../../models/search';
import { RoomTypeResult } from '../../models/room';
import {
  ReservationPayload,
  ReservationResponse,
  ReservationStatusResponse,
  ReservationPaymentStatusResponse,
} from '../../models/reservation';

export let client: AxiosClient;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  client = new AxiosClient('/');
} else {
  client = new AxiosClient('https://hilbert.himkwtn.me/');
}

export class BackendAPI {
  static ping() {
    return client.get<{ message: string }>('/ping');
  }
  static authPing() {
    return client.get<AuthPayload>('/auth/ping');
  }
  static login(data: LoginModel) {
    return client.post<AuthPayload>('/auth/login', data);
  }
  static register(data: RegistrationModel) {
    return client.post<AuthPayload>('/auth/register', data);
  }

  static searchRooms(data: RoomSearchPayload) {
    return client.get<RoomTypeResult[]>('/reservation', { params: data });
  }

  static reservations() {
    return client.get<ReservationStatusResponse[]>('/reservation/all');
  }

  static reserve(data: ReservationPayload) {
    return client.post<ReservationResponse>('/reservation', data);
  }

  static reservationStatus(id: string) {
    return client.get<ReservationStatusResponse>('/reservation/' + id);
  }

  static paymentStatus(id: string) {
    return client.get<ReservationPaymentStatusResponse>(
      '/reservation/' + id + '/payment'
    );
  }

  static openDoor() {
    return client.post('/door/lock', {});
  }
  static closeDoor() {
    return client.post('/door/unlock', {});
  }
  static sound() {
    return client.post('/door/sound', {});
  }
}
