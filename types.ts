
export enum Category {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory',
  DRESS = 'Dress'
}

export interface ClothingItem {
  id: string;
  image: string;
  category: Category;
  color: string;
  style: string;
  subCategory: string;
  season: string[];
  wearCount: number;
  lastWorn?: string;
  dateAdded: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Work' | 'Casual' | 'Formal' | 'Date' | 'Sports';
  date: string;
}

export interface SuggestedOutfit {
  items: ClothingItem[];
  reasoning: string;
  confidence: number;
}
