// Pricing and tier provision configuration
import { SubscriptionTier } from "./types";

export const PRICING_MAP: Record<SubscriptionTier, {
  basePrice: number;
  perBusPrice: number;
  hardwareKitPrice: number;
  setupFee: number;
  features: string[];
}> = {
  BASIC: {
    basePrice: 3000,
    perBusPrice: 150,
    hardwareKitPrice: 200,
    setupFee: 3000,
    features: [
      "Core routing AI",
      "Standard support",
      "Basic reporting",
    ],
  },
  PROFESSIONAL: {
    basePrice: 5000,
    perBusPrice: 310,
    hardwareKitPrice: 200,
    setupFee: 3000,
    features: [
      "Advanced routing AI",
      "Priority support",
      "Detailed analytics",
      "Custom branding",
    ],
  },
  ENTERPRISE: {
    basePrice: 10000,
    perBusPrice: 460,
    hardwareKitPrice: 200,
    setupFee: 3000,
    features: [
      "All Professional features",
      "Dedicated account manager",
      "Full API access",
      "On‑premise deployment option",
      "24/7 premium support",
    ],
  },
};

// Placeholder mock data for services that import these constants
export const MOCK_TENANTS: any[] = [];
export const MOCK_INVOICES: any[] = [];
export const MOCK_POS: any[] = [];
export const MOCK_QUOTES: any[] = [];
export const INITIAL_PRICING_CONFIG: any = {};

// Additional placeholder data for services
export const INITIAL_ROUTES: any[] = [];
export const INITIAL_STUDENTS: any[] = [];
export const INITIAL_LOGS: any[] = [];
export const INITIAL_TICKETS: any[] = [];
export const INITIAL_BUDGET_DATA: any[] = [];
export const RECOMMENDED_HARDWARE: any[] = [];

// Tier‑specific feature lists for UI cards
export const FEATURES_BY_TIER: Record<SubscriptionTier, string[]> = {
  BASIC: [
    "Core routing AI",
    "Standard support",
    "Basic reporting",
  ],
  PROFESSIONAL: [
    "Advanced routing AI",
    "Priority support",
    "Detailed analytics",
    "Custom branding",
  ],
  ENTERPRISE: [
    "All Professional features",
    "Dedicated account manager",
    "Full API access",
    "On‑premise deployment option",
    "24/7 premium support",
  ],
};
