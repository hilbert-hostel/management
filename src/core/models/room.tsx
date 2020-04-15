export interface Room {
  id: number;
  type: string;
  description: string;
  available: number;
  price: number;
  photo?: string;
  facilities: string[];
}

export interface RoomTypeResult {
  price: number;
  description: string;
  photos: RoomPhoto[];
  facilities: { name: string; description?: string; count: number }[];
  rooms: { id: number; beds: { id: string }[] }[];
  type: string;
}

export interface RoomPhoto {
  photo_url: string;
  photo_description?: string;
}
