import type { CustomerIconName } from "../components/customer-icons";

export type ServiceCategoryId = "all" | "personal" | "business" | "wealth";

type CustomerNavLink = {
  href: string;
  label: string;
};

type ServiceFilter = {
  id: ServiceCategoryId;
  label: string;
};

type HeroMetric = {
  value: string;
  label: string;
};

type HeroQueueItem = {
  id: string;
  title: string;
  detail: string;
  icon: CustomerIconName;
};

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: CustomerIconName;
  categories: ServiceCategoryId[];
  badge?: string;
  illustration: "savings" | "mortgage" | "business" | "wire";
};

type FooterColumn = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

export const customerNavLinks: CustomerNavLink[] = [
  { href: "#services", label: "Services" },
  { href: "#book-now", label: "Book Now" },
  { href: "#locations", label: "Locations" },
  { href: "#support", label: "Support" },
];

export const serviceFilters: ServiceFilter[] = [
  { id: "all", label: "All Services" },
  { id: "personal", label: "Personal Banking" },
  { id: "business", label: "Business Accounts" },
  { id: "wealth", label: "Wealth & Loans" },
];

export const heroMetrics: HeroMetric[] = [
  { value: "12 min", label: "Average branch wait" },
  { value: "4", label: "Branches live now" },
  { value: "98%", label: "Bookings on schedule" },
];

export const heroQueueItems: HeroQueueItem[] = [
  {
    id: "slot",
    title: "Next premium slot",
    detail: "Today, 2:40 PM",
    icon: "clock",
  },
  {
    id: "branch",
    title: "Suggested branch",
    detail: "Central Avenue, 1.4 km away",
    icon: "map-pin",
  },
  {
    id: "security",
    title: "Ready to confirm",
    detail: "Digital ID and SMS check enabled",
    icon: "shield",
  },
];

export const serviceCards: ServiceCard[] = [
  {
    id: "savings-account-opening",
    title: "Savings Account Opening",
    description:
      "Open a high-interest savings account in minutes. Perfect for everyday savings or long-term financial goals. Our digital process is entirely paperless for eligible customers.",
    duration: "15-20 mins",
    icon: "piggy",
    categories: ["all", "personal"],
    badge: "Popular",
    illustration: "savings",
  },
  {
    id: "home-mortgage-consultation",
    title: "Home Mortgage Consultation",
    description:
      "Meet with our mortgage specialists to discuss your first home or refinancing options. We'll help you navigate rates, terms, and pre-approval requirements.",
    duration: "45-60 mins",
    icon: "house",
    categories: ["all", "wealth"],
    illustration: "mortgage",
  },
  {
    id: "small-business-setup",
    title: "Small Business Setup",
    description:
      "Ready to grow? Set up your business checking account and merchant services. Our experts provide tailored advice for entrepreneurs at any stage.",
    duration: "30-40 mins",
    icon: "briefcase",
    categories: ["all", "business"],
    illustration: "business",
  },
  {
    id: "international-wire-transfer",
    title: "International Wire Transfer",
    description:
      "Send money securely across borders. We offer competitive exchange rates and fast processing for global transactions. Identity verification required in person.",
    duration: "10-15 mins",
    icon: "cash",
    categories: ["all", "personal", "wealth"],
    illustration: "wire",
  },
];

export function filterCustomerServices(
  activeCategory: ServiceCategoryId,
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return serviceCards.filter((service) => {
    const matchesCategory =
      activeCategory === "all" || service.categories.includes(activeCategory);

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [service.title, service.description, service.duration]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}

export const serviceAvailabilityLabel = "bookable services available today";

export const preBookingChecklist = [
  "Valid Government Photo ID (Passport or Driver's License)",
  "Proof of Address (Utility bill or Lease agreement)",
  "Social Security Number or Tax ID",
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About SmartQ", href: "#book-now" },
      { label: "Branch Locations", href: "#locations" },
      { label: "Contact Support", href: "#support" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Personal Banking", href: "#services" },
      { label: "Business Accounts", href: "#services" },
      { label: "Loans and Wealth", href: "#services" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Notice", href: "/register" },
      { label: "Terms of Service", href: "/register" },
    ],
  },
];
