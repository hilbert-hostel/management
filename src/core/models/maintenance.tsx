export interface Maintenance {
  id: number;
  roomID: number;
  from: Date;
  to: Date;
  description: string;
}

export interface CreateMaintenanceModel {
  roomID: number;
  from: Date;
  to: Date;
  description: string;
}

export interface CreateMaintenancePayload {
  roomID: number;
  from: string;
  to: string;
  description: string;
}
