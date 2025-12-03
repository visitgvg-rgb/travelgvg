export type MultiLangString = {
  mk: string;
  en: string;
  sr: string;
  el: string;
};

export interface InfoSlide {
  image: string;
  text?: MultiLangString;
}

export interface BaseListing {
  id: string;
  package: 'premium' | 'standard' | 'free';
  category: string;
  title: MultiLangString;
  description: MultiLangString;
  shortDescription?: MultiLangString;
  images: string[];
  contact: {
    phone: string;
    website?: string;
    whatsapp?: string;
    viber?: string;
    facebook?: string;
    instagram?: string;
  };
  mapSrc: string;
  video?: string;
  rating?: {
    score: number;
    reviews: number;
    ratingSource?: 'google';
  };
  infoSlides?: InfoSlide[];
}

export interface RoomGallery {
  title: MultiLangString;
  images: string[];
}

export interface Accommodation extends BaseListing {
  amenities: string[]; // These will be keys, e.g., "parking", "wifi"
  roomGalleries?: RoomGallery[];
  priceFrom?: { [key: string]: number };
  currency?: { [key: string]: string };
  discount?: string;
}

export interface Restaurant extends BaseListing {
  details: {
    [key: string]: MultiLangString;
  };
  features?: string[];
  photoGalleries?: RoomGallery[];
  highlight?: MultiLangString;
}

export interface Pomos {
  id: string;
  package: 'premium' | 'standard';
  category: string;
  title: MultiLangString;
  description: MultiLangString;
  shortDescription?: MultiLangString;
  contact: { phone: string };
  mapSrc: string;
  workingHours?: string;
  images?: string[];
  rating?: {
    score: number;
    reviews: number;
    ratingSource?: 'google';
  };
}

export interface Ponuda extends BaseListing {
  businessName: MultiLangString;
  details: {
    [key: string]: MultiLangString;
  };
}

export interface Prikazna extends BaseListing {
  publicationDate: string;
  author: string;
  authorAvatar?: string;
  fullContent: MultiLangString;
  relatedPosts: string[];
}

export interface Event {
  id: string;
  title: MultiLangString;
  description: MultiLangString;
  image: string;
  date: string;
  time: string;
  location: MultiLangString;
  locationUrl?: string;
  category: string; // This is a key, e.g., "music", "culture"
}

export interface Photographer {
  id: string;
  name: MultiLangString;
  portraitImage: string;
  bio: MultiLangString;
  socials: {
    instagram?: string;
    facebook?: string;
  };
  season: MultiLangString;
  gallery: string[];
}


export interface FaqItem {
    question: MultiLangString;
    answer: MultiLangString;
}

export interface FaqCategory {
    category: string;
    title: MultiLangString;
    items: FaqItem[];
}

export interface TermSection {
    title: MultiLangString;
    content: MultiLangString;
}

export type Listing = Accommodation | Restaurant | Ponuda | Prikazna | Pomos;

export interface Banner {
  id: string;
  type: 'promo' | 'featured' | 'event' | 'info';
  placement: string[];
  content: {
    title: MultiLangString;
    subtitle: MultiLangString;
    ctaText: MultiLangString;
    image: {
      desktop: string;
      mobile: string;
    };
    link: string;
  };
  config: {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    priority?: number;
    targetCategory?: string;
  };
}

export interface Short {
  id: string;
  title: MultiLangString;
  videoUrl: string;
  ctaText: MultiLangString;
  ctaLink: string;
  category: 'hrana' | 'smestuvanje' | 'atrakcii' | 'opsto';
  featured: boolean;
}