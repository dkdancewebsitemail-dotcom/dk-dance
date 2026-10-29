export type MediaType = "image" | "video";

export type MediaCategory =
  | "Classes"
  | "Performances"
  | "Stage Shows"
  | "Competitions"
  | "School Programs"
  | "Cultural Events"
  | "Workshops"
  | "Special Training"
  | "Branch Activities"
  | "Bournemouth";

export interface MediaItem {
  _id?: string;
  type: MediaType;
  url: string;
  key?: string;
  name?: string;
  title: string;
  description?: string;
  category: MediaCategory;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  duration?: string;
  featuredOnHome?: boolean;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  _id?: string;
  name: string;
  slug: string;
  country: string;
  state?: string;
  city: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  imageUrl?: string;
  imageKey?: string;
  classTimings?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EnquiryStatus = "new" | "read" | "contacted" | "closed";

export interface Enquiry {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  age?: string;
  branch: string;
  danceStyle: string;
  mode: "offline" | "online";
  message?: string;
  status: EnquiryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  director: string;
  headOffice: string;
  internationalBranch: string;
  intro: string;
  mission: string;
  vision: string;
  fees: {
    admissionFee: string;
    weeklyOneClassFee: string;
    weeklyTwoClassesFee: string;
    disclaimer: string;
    paymentNote: string;
  };
  onlineClasses: {
    headline: string;
    description: string;
    features: string[];
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    website: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  stats?: StatItem[];
  heroVideoUrl?: string;
  heroVideoKey?: string;
  updatedAt?: string;
}

export interface StatItem {
  target: number;
  suffix?: string;
  label: string;
}

export interface AuthSession {
  username: string;
  role: "admin";
  exp: number;
  iat: number;
}

export interface DanceStyle {
  _id?: string;
  number: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  imageKey?: string;
  features: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurriculumModule {
  _id?: string;
  title: string;
  desc: string;
  badge?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewItem {
  _id?: string;
  author: string;
  avatarLetter?: string;
  avatarBg?: string;
  badge?: string;
  rating: number; // 1 to 5
  timeAgo?: string;
  text: string;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

