export type CustomerIconName =
  | "bank"
  | "shield"
  | "user-plus"
  | "wallet"
  | "card"
  | "briefcase"
  | "search"
  | "map"
  | "map-pin"
  | "list"
  | "user"
  | "clock"
  | "qr"
  | "piggy"
  | "cash"
  | "check-circle"
  | "house"
  | "clipboard";

type IconProps = {
  name: CustomerIconName;
};

export function CustomerIcon({ name }: IconProps) {
  if (name === "bank") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9h18" />
        <path d="M5 9v8" />
        <path d="M10 9v8" />
        <path d="M14 9v8" />
        <path d="M19 9v8" />
        <path d="M2 20h20" />
        <path d="m12 3 9 4v2H3V7l9-4Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 5 6v6c0 4.4 2.9 8.4 7 9 4.1-.6 7-4.6 7-9V6l-7-3Z" />
        <path d="m9.3 12 1.8 1.8 3.7-4" />
      </svg>
    );
  }

  if (name === "user-plus") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
        <path d="M4 20a8 8 0 0 1 10.6-7.5" />
        <path d="M19 11v6" />
        <path d="M16 14h6" />
      </svg>
    );
  }

  if (name === "wallet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M16 12h5" />
        <path d="M7 6V4h10v2" />
        <circle cx="16" cy="12" r="1" />
      </svg>
    );
  }

  if (name === "card") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M9 7V5h6v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
        <path d="M9 4v14" />
        <path d="M15 6v14" />
      </svg>
    );
  }

  if (name === "map-pin") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }

  if (name === "list") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 7h12" />
        <path d="M8 12h12" />
        <path d="M8 17h12" />
        <circle cx="4" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3 2" />
      </svg>
    );
  }

  if (name === "qr") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="5" height="5" rx="1" />
        <rect x="15" y="4" width="5" height="5" rx="1" />
        <rect x="4" y="15" width="5" height="5" rx="1" />
        <path d="M15 15h2v2h-2z" />
        <path d="M18 18h2v2h-2z" />
        <path d="M17 12v3" />
        <path d="M12 17h3" />
      </svg>
    );
  }

  if (name === "piggy") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18.5 10.5a2.5 2.5 0 0 1 1.5 2.3A4.2 4.2 0 0 1 16 17h-1l-1 2h-2l.4-1.7H9.2L8 19H6l.4-2A5 5 0 0 1 5 13c0-3.1 2.8-5.5 6.4-5.5h2.3c1.2-1.3 2.8-2 4.6-2" />
        <path d="M10.5 10.5h2" />
        <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
        <path d="M19 8.5V6" />
      </svg>
    );
  }

  if (name === "cash") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7 9h.01" />
        <path d="M17 15h.01" />
      </svg>
    );
  }

  if (name === "check-circle") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.3 2.3L15.8 9.5" />
      </svg>
    );
  }

  if (name === "house") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m4 11.5 8-6 8 6" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M10 20v-5.5h4V20" />
      </svg>
    );
  }

  if (name === "clipboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="5" width="12" height="16" rx="2" />
        <path d="M9 5.5h6" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
        <path d="M10 3h4a1 1 0 0 1 1 1v2H9V4a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}
