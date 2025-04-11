interface Room {
  name: string;
  description: string;
  price: string | null;
  image: string;
}

export type GetRoomsServiceOutputDto = Room[];
