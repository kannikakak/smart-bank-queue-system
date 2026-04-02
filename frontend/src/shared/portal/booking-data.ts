import type { PortalRole } from "@/shared/portal/portal-role";

export type BookingParams = {
  branch?: string;
  service?: string;
  date?: string;
  time?: string;
  confirmed?: string;
  appointmentId?: string;
};

export type BookingBranch = {
  id: string;
  name: string;
  address: string;
  hours: string;
  appointmentSupport: string;
  note: string;
};

export type BookingService = {
  id: string;
  title: string;
  duration: string;
  availability: string;
  description: string;
};

export type BookingDateOption = {
  value: string;
  label: string;
  longLabel: string;
};

export const customerBranches: BookingBranch[] = [
  {
    id: "bokor",
    name: "Bokor Branch",
    address: "No721, Preah Monivong Blvd., Sangkat Boeng Keng Kang Ti Bei, Khan Boeng Keng Kang, Phnom Penh",
    hours: "08:00 - 20:00",
    appointmentSupport: "Full-service appointment and advisor support",
    note: "Official Wing Bank branch in Phnom Penh with advisor-led consultations and document support.",
  },
  {
    id: "aeon-mean-chey",
    name: "AEON Mall Mean Chey Branch",
    address: "Unit F027, 1st Floor, Hun Sen Blvd, Sangkat Chak Angrae Kraom, Khan Mean Chey, Phnom Penh",
    hours: "09:00 - 21:00",
    appointmentSupport: "Daily branch appointments and quick assistance",
    note: "Official Wing Bank branch inside AEON Mall Mean Chey with seven-day advisor availability.",
  },
  {
    id: "head-office",
    name: "Head Office",
    address: "Wing Tower Building, Preah Monivong Blvd corner Kampuchea Krom, Sangkat Monourom, Khan Prampir Meakkakra, Phnom Penh",
    hours: "08:00 - 20:00",
    appointmentSupport: "Head-office consultations and specialist support",
    note: "Wing Bank head office in Phnom Penh with broader consultation coverage.",
  },
  {
    id: "orkide-2004",
    name: "Orkide 2004 Branch",
    address: "Building SHR1#35, Street 2004, Orchide Village, Sangkat Ou Baek K'am, Khan Saensokh, Phnom Penh",
    hours: "08:00 - 20:00",
    appointmentSupport: "Account, loan, and branch advisory appointments",
    note: "Official Wing Bank branch along Street 2004 in Phnom Penh.",
  },
  {
    id: "ppsez",
    name: "Phnom Penh Special Economic Zone Branch",
    address: "No. 115, 117 and 119, Street No.1, Trapeang Kol Village, Sangkat Kantaok, Khan Kamboul, Phnom Penh",
    hours: "08:00 - 20:00",
    appointmentSupport: "Business, payroll, and employer support visits",
    note: "Official Wing Bank branch serving customers in Phnom Penh Special Economic Zone.",
  },
  {
    id: "wat-phnom",
    name: "Wat Phnom Branch",
    address: "No. 246, E0, Street Monivong Blvd, Sangkat Boeng Reang, Khan Daun Penh, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointments with self-service guidance",
    note: "Official Wing Bank city branch with published branch and ATM/CRM presence.",
  },
  {
    id: "tuol-kouk",
    name: "Tuol Kouk Branch",
    address: "#22, Street N289, Sangkat Boeng Kak Ti Muoy, Khan Tuol Kouk, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointments with self-service guidance",
    note: "Official Wing Bank Tuol Kouk branch listed on the public branch directory.",
  },
  {
    id: "saensokh",
    name: "Saensokh Branch",
    address: "No 9, 10, 11, 12A & 12B, Street No 1003, Sangkat Phnom Penh Thmei, Khan Saensokh, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointments with self-service guidance",
    note: "Official Wing Bank Saensokh branch with published branch and ATM/CRM access.",
  },
  {
    id: "preah-yukunthor",
    name: "Preah Yukunthor Branch",
    address: "Building 99, 101 and 103, Preah Sihanouk Blvd, Sangkat Boeng Proluet, Khan Prampir Meakkakra, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointments with self-service guidance",
    note: "Official Wing Bank Preah Yukunthor branch in Phnom Penh.",
  },
  {
    id: "independence-monument",
    name: "Independence Monument Branch",
    address: "No 130 E0 E1 E2, Preah Sihanouk Blvd (274), Sangkat Boeng Keng Kang Ti Muoy, Khan Boeng Keng Kang, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Appointments, branch support, and self-service guidance",
    note: "Official Wing Bank branch near Independence Monument with branch and self-service facilities.",
  },
  {
    id: "boeng-trabaek",
    name: "Boeng Trabaek Branch",
    address: "Building No. 759 and 761, Monivong Blvd, corner Street 432, Sangkat Boeng Trabaek, Khan Chamkar Mon, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Main branch customer consultations",
    note: "Official Wing Bank branch along Monivong Blvd in Boeng Trabaek.",
  },
  {
    id: "tuek-thla",
    name: "Tuek Thla Branch",
    address: "No 99, Russian Federation Blvd, Sangkat Tuek Thla, Khan Saensokh, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointments with self-service guidance",
    note: "Official Wing Bank Tuek Thla branch in Phnom Penh.",
  },
  {
    id: "nssf",
    name: "National Social Security Fund Branch",
    address: "NSSF Building, Ground Floor, NSSF-G03, Sangkat Khmounh, Khan Saensokh, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Branch appointment service point",
    note: "Official Wing Bank branch at the National Social Security Fund building in Phnom Penh.",
  },
  {
    id: "chrouy-changvar",
    name: "Chrouy Changvar Branch",
    address: "GDT Tower, OCIC Blvd. corner Damrei Srot Street, Sangkat Chrouy Changvar, Khan Chrouy Changvar, Phnom Penh",
    hours: "08:00 - 16:00",
    appointmentSupport: "Full-service appointment and advisor support",
    note: "Official Wing Bank Chrouy Changvar branch at GDT Tower in Phnom Penh.",
  },
];

export const bookingServices: BookingService[] = [
  {
    id: "account",
    title: "Savings / Current Account Opening",
    duration: "20 min",
    availability: "Advisor-led appointment",
    description: "Open a Wing Bank savings or current account and get help with account setup.",
  },
  {
    id: "loan",
    title: "Personal Loan Consultation",
    duration: "45 min",
    availability: "Advisor required",
    description: "Discuss Wing Bank personal loan options and application requirements with branch staff.",
  },
  {
    id: "card",
    title: "Debit / Card Services",
    duration: "30 min",
    availability: "Card support appointment",
    description: "Apply for or get help with Wing Bank debit cards, CSS cards, and card-related support.",
  },
  {
    id: "transfer",
    title: "International Money Transfer",
    duration: "25 min",
    availability: "Transfer support",
    description: "Get help sending or receiving international money transfers through Wing Bank services.",
  },
  {
    id: "atm-crm",
    title: "ATM / CRM Self-Banking Support",
    duration: "15 min",
    availability: "Quick support",
    description: "Assistance for cash deposit, cash withdrawal, PIN change, and other ATM/CRM self-banking services.",
  },
];

export function buildPortalUrl(
  role: PortalRole,
  params: BookingParams = {},
  hash?: string,
) {
  const search = new URLSearchParams({ role });

  if (params.branch) {
    search.set("branch", params.branch);
  }

  if (params.service) {
    search.set("service", params.service);
  }

  if (params.date) {
    search.set("date", params.date);
  }

  if (params.time) {
    search.set("time", params.time);
  }

  if (params.confirmed) {
    search.set("confirmed", params.confirmed);
  }

  if (params.appointmentId) {
    search.set("appointmentId", params.appointmentId);
  }

  return `/portal?${search.toString()}${hash ? `#${hash}` : ""}`;
}

export function getHoursRange(hours: string) {
  const [open = hours, close = hours] = hours.split(" - ");
  return { open, close };
}

export function getBranchMapUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildBranchesUrl(
  role: PortalRole,
  params: BookingParams = {},
  hash?: string,
) {
  const search = new URLSearchParams({ role });

  if (params.branch) {
    search.set("branch", params.branch);
  }

  if (params.service) {
    search.set("service", params.service);
  }

  if (params.date) {
    search.set("date", params.date);
  }

  if (params.time) {
    search.set("time", params.time);
  }

  if (params.confirmed) {
    search.set("confirmed", params.confirmed);
  }

  if (params.appointmentId) {
    search.set("appointmentId", params.appointmentId);
  }

  return `/portal/branches?${search.toString()}${hash ? `#${hash}` : ""}`;
}

export function buildBookingsUrl(
  role: PortalRole,
  params: BookingParams = {},
) {
  const search = new URLSearchParams({ role });

  if (params.branch) {
    search.set("branch", params.branch);
  }

  if (params.service) {
    search.set("service", params.service);
  }

  if (params.date) {
    search.set("date", params.date);
  }

  if (params.time) {
    search.set("time", params.time);
  }

  if (params.confirmed) {
    search.set("confirmed", params.confirmed);
  }

  if (params.appointmentId) {
    search.set("appointmentId", params.appointmentId);
  }

  return `/portal/bookings?${search.toString()}`;
}

export function getDateOptions() {
  const shortFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const longFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return Array.from({ length: 5 }, (_, index): BookingDateOption => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      value: date.toISOString().slice(0, 10),
      label: shortFormatter.format(date),
      longLabel: longFormatter.format(date),
    };
  });
}

export function formatTimeLabel(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getTimeSlots(serviceId?: string, branchId?: string) {
  const serviceSlots: Record<string, string[]> = {
    account: ["08:45", "09:30", "10:15", "11:30", "13:00", "15:15"],
    loan: ["09:00", "10:30", "12:00", "14:00", "16:00"],
    card: ["09:15", "10:45", "13:30", "15:00", "16:30"],
    transfer: ["08:30", "10:00", "11:45", "14:15", "15:45"],
    "atm-crm": ["08:15", "09:45", "11:15", "13:15", "15:30"],
  };

  const branchOffset =
    branchId === "aeon-mean-chey"
      ? 1
      : branchId === "saensokh"
        ? 2
        : branchId === "tuek-thla"
          ? 1
          : branchId === "chrouy-changvar"
            ? 2
            : 0;
  const slots = serviceSlots[serviceId ?? "account"] ?? serviceSlots.account;

  return slots.filter((_, index) => (index + branchOffset) % 4 !== 3);
}

export function getBookingSelection(params?: BookingParams) {
  return getBookingSelectionWithData(params, customerBranches, bookingServices);
}

export function getBookingSelectionWithData(
  params: BookingParams | undefined,
  branches: BookingBranch[],
  services: BookingService[],
) {
  const dateOptions = getDateOptions();
  const selectedBranch = branches.find((branch) => branch.id === params?.branch);
  const selectedService = selectedBranch
    ? services.find((service) => service.id === params?.service)
    : undefined;
  const selectedDate =
    selectedBranch && selectedService
      ? dateOptions.find((date) => date.value === params?.date)
      : undefined;
  const timeSlots =
    selectedBranch && selectedService ? getTimeSlots(selectedService.id, selectedBranch.id) : [];
  const selectedTime = timeSlots.includes(params?.time ?? "") ? params?.time : undefined;
  const isConfirmed =
    params?.confirmed === "1" &&
    Boolean(selectedBranch && selectedService && selectedDate && selectedTime);

  return {
    dateOptions,
    selectedBranch,
    selectedService,
    selectedDate,
    timeSlots,
    selectedTime,
    isConfirmed,
  };
}
