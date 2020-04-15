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
import { User } from '../../models/user';

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
    return client.get<AuthPayload>('/admin/ping');
  }
  static login(data: LoginModel) {
    return client.post<AuthPayload>('/admin/login', data);
  }

  static rooms() {
    return client.get<RoomTypeResult[]>('/admin/room');
  }

  static reservations(params: { from: string; to: string }) {
    return client.get<ReservationStatusResponse[]>('/admin/reservation', {
      params,
    });
  }

  static guests() {
    return client.get<User[]>('/admin/guest');
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
