export type ProjectType = "website" | "shop" | "landing" | "bio" | "wordpress";
export type Budget = "do-1000" | "1000-2500" | "2500-5000" | "5000+";
export type Timeline = "asap" | "1-miesiac" | "2-3-miesiace" | "bez-presji";
export type ContentStatus = "gotowe" | "czesciowe" | "brak";

export type LeadFormData = {
  projectType: ProjectType;
  hasDomain: boolean;
  hasHosting: boolean;
  contentStatus: ContentStatus;
  budget: Budget;
  timeline: Timeline;

  // Strona firmowa
  websitePages: "one-page" | "2-5" | "6-10";
  serviceCount: "1-3" | "4-8" | "9+";
  hasBrandAssets: boolean;
  needsContactForm: boolean;
  needsAnalytics: boolean;
  needsBlog: boolean;
  needsBooking: boolean;
  needsMultilanguage: boolean;

  // Sklep
  productCount: "1-10" | "11-30" | "31-100" | "100+";
  productContentReady: boolean;
  shopCategoryCount: "1-3" | "4-8" | "9+";
  needsVariants: boolean;
  needsPayments: boolean;
  needsShipping: boolean;
  needsInvoicing: boolean;
  needsMigration: boolean;
  needsCustomerAccounts: boolean;
  needsPromoCodes: boolean;

  // Landing page
  landingSize: "single-screen" | "standard" | "sales";
  hasBrandAssetsLanding: boolean;
  needsCopywriting: boolean;
  needsAdsTracking: boolean;
  formComplexity: "none" | "simple" | "advanced";
  needsVideoSection: boolean;
  needsSocialProof: boolean;

  // Link w bio
  bioLinks: "1-5" | "6-10" | "10+";
  needsGallery: boolean;
  needsNewsletter: boolean;
  needsBioProducts: boolean;
  needsCustomDomain: boolean;
  needsLinkAnalytics: boolean;

  // WordPress / WooCommerce
  wordpressTask: "small-fix" | "visual" | "new-page" | "woocommerce" | "audit";
  workHours: "1" | "2-3" | "4-6" | "7+";
  isUrgentFix: boolean;
  hasAdminAccess: boolean;
  isLiveSite: boolean;
  hasPluginIssues: boolean;

  description: string;
  name: string;
  email: string;
  phone: string;
};

export type EstimateBreakdownItem = {
  label: string;
  min: number;
  max: number;
};

export type EstimateResult = {
  minPrice: number;
  maxPrice: number;
  timelineLabel: string;
  projectTypeLabel: string;
  features: string[];
  breakdown: EstimateBreakdownItem[];
  budgetFit: "within" | "close" | "below" | "unknown";
  briefSummary: string;
};

export type LeadSubmission = {
  id: string;
  submittedAt: string;
  formData: LeadFormData;
  estimate: EstimateResult;
};

export type ApiResponse = {
  success: boolean;
  estimate?: EstimateResult;
  leadId?: string;
  error?: string;
};
