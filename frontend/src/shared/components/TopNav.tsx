import Link from "next/link";

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 3 7v2h18V7l-9-4Zm-6 8h2v6H6v-6Zm5 0h2v6h-2v-6Zm5 0h2v6h-2v-6ZM3 19h18v2H3v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5A9.5 9.5 0 0 0 12 2.5Zm0 15a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Zm1.14-5.5-.51.33a1.44 1.44 0 0 0-.63 1.17v.23h-1.8v-.33a2.72 2.72 0 0 1 1.27-2.33l.7-.45a1.5 1.5 0 1 0-2.37-1.22H8a3.3 3.3 0 1 1 5.14 2.72Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5A9.5 9.5 0 0 0 12 2.5Zm6.97 8.6h-3.06a15.16 15.16 0 0 0-1.22-4.67A7.54 7.54 0 0 1 18.97 11.1Zm-6.97 8.32c-.87 0-2.07-1.66-2.65-4.32h5.3c-.58 2.66-1.78 4.32-2.65 4.32Zm-3.02-6.12a13.45 13.45 0 0 1 0-2.4h6.04a13.45 13.45 0 0 1 0 2.4H8.98Zm.37-6.87a15.16 15.16 0 0 0-1.22 4.67H5.03a7.54 7.54 0 0 1 4.32-4.67ZM5.03 12.9h3.06a15.16 15.16 0 0 0 1.22 4.67 7.54 7.54 0 0 1-4.28-4.67Zm9.66 4.67a15.16 15.16 0 0 0 1.22-4.67h3.06a7.54 7.54 0 0 1-4.28 4.67Zm-.04-11.89a15.05 15.05 0 0 1 1.31 3.62H8.04a15.05 15.05 0 0 1 1.31-3.62 3.63 3.63 0 0 1 2.65-1.98 3.63 3.63 0 0 1 2.65 1.98Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="brand" aria-label="SmartQ Home">
        <span className="brand-badge" aria-hidden="true">
          <BankIcon />
        </span>
        <span className="brand-name">SmartQ</span>
      </Link>

      <div className="top-nav-actions">
        <Link href="/portal?role=customer#support" className="support-link" aria-label="Get support">
          <span className="support-icon" aria-hidden="true">
            <HelpIcon />
          </span>
          <span>Support</span>
        </Link>

        <button
          type="button"
          className="language-button"
          aria-label="Change language"
          suppressHydrationWarning
        >
          <GlobeIcon />
        </button>
      </div>
    </header>
  );
}
