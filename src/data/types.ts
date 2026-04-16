export interface Museum {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  country: string;
  coverImage: string;
  description: string;
  practicalInfo: {
    ticketPrice: string;
    openingHours: string;
    reservation: string;
    transportation: string;
    tips: string[];
  };
  floorMap: {
    overview: string;
    floors: Floor[];
  };
  highlights: Exhibit[];
  hiddenGems: Exhibit[];
  recommendedRoutes: Route[];
}

export interface Floor {
  id: string;
  name: string;
  description: string;
  zones: string[];
}

export interface Exhibit {
  id: string;
  name: string;
  nameOriginal?: string;
  image: string;
  period: string;
  location: string;
  artist?: string;
  description: string;
  funFact?: string;
  audioGuideNo?: string;
}

export interface Route {
  id: string;
  duration: string;
  durationLabel: string;
  overview: string;
  designThought: string;
  stops: RouteStop[];
}

export interface RouteStop {
  order: number;
  exhibitId: string;
  exhibitName: string;
  stayMinutes: number;
  tip?: string;
}
