
export const APP_VERSION = "v3.3.0-GOLDEN-MASTER";

export type UserDemographic = 'JUNIOR' | 'ADULT' | 'SENIOR' | 'UNKNOWN';

export enum EvacuatorStyle {
  STANDARD = 'standard',
  TACTICAL = 'tactical',
  EMPATHETIC = 'empathetic'
}

export const EMERGENCY_TEMPLATES = [
  { id: 'safe', label: 'JESTEM BEZPIECZNY', text: 'Jestem bezpieczny w punkcie ewakuacyjnym Szczecin SafePoint. Wszystko w porządku.' },
  { id: 'sos', label: 'SOS / POMOC', text: 'UWAGA: Potrzebuję pilnej pomocy w Szczecinie! Moja lokalizacja została udostępniona służbom.' },
  { id: 'evac', label: 'EWAKUACJA', text: 'Ewakuuję się właśnie do najbliższego schronu. Proszę śledzić moją pozycję.' },
  { id: 'radio', label: 'RADIO', text: 'Słucham Polskiego Radia Szczecin (101.2 FM). Czekam na dalsze komunikaty.' }
];

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: 'underground' | 'shelter' | 'medical' | 'user_proposed';
  verified: boolean;
  aiVerified?: boolean; 
  timestamp?: number; 
  ownerId?: string; // For private markers
}

export interface MarkerReport {
  id: string;
  markerId: string;
  markerTitle: string;
  reason: string;
  timestamp: number;
  status: 'PENDING' | 'REVIEWED' | 'ACTIONED';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingUrls?: string[];
  detectedDemographic?: UserDemographic;
  emotionCheck?: boolean;
}

export enum AppMode {
  LIGHT = 'light',
  DARK = 'dark' 
}

export enum MapProvider {
  OSM = 'OpenStreetMap',
  CYCLOSM = 'CyclOSM (Bicycle)',
}

export enum GeminiModelType {
  FAST = 'fast', 
  SMART = 'smart', 
  SEARCH = 'search', 
  MAPS = 'maps', 
}

export enum EvacuatorLanguage {
  PL = 'PL',
  EN = 'EN'
}

export enum FontSize {
  SMALL = 'text-xs',
  MEDIUM = 'text-base',
  LARGE = 'text-lg',
  XLARGE = 'text-xl'
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: 'FAMILY' | 'MEDIC' | 'COMMUNITY' | 'OTHER';
  phone: string;
  email?: string;
  notes?: string;
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
  source: string;
  externalLink?: string;
}

export interface AdminMessage {
  id: string;
  text: string;
  timestamp: number;
  location?: { lat: number; lng: number };
  isDistress?: boolean;
  demographic?: UserDemographic;
}

export interface PublicMessage {
  id: string;
  text: string;
  timestamp: number;
  isAdmin: boolean;
  userHandle: string;
}
