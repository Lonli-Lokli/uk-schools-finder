export type School = {
    id: string;
    name: string;
    type: string;
    rating: string;
    location: {
      lat: number;
      lng: number;
    };
  };