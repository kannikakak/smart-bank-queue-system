import Link from "next/link";
import type { BookingParams } from "@/shared/portal/booking-data";
import { buildBookingsUrl, buildBranchesUrl, buildPortalUrl } from "@/shared/portal/booking-data";
import { PortalSectionHeader } from "@/shared/components/portal/PortalSectionHeader";
import {
  AccountIcon,
  BusinessIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  HelpIcon,
  LightningIcon,
  LoanIcon,
  MapIcon,
  PhoneIcon,
  PortalShieldIcon,
  WealthIcon,
} from "@/shared/components/portal/PortalIcons";

type CustomerPortalHomeProps = {
  params: BookingParams;
  isConfirmed: boolean;
};

export function CustomerPortalHome({ params, isConfirmed }: CustomerPortalHomeProps) {
  const role = "customer";
  const processCards = [
    {
      title: "Select Branch",
      description:
        "Start by choosing the branch you want to visit before moving to the next step.",
      action: "Select Branch",
      icon: <MapIcon />,
      href: buildBranchesUrl(role, {}, "branch-selection"),
    },
    {
      title: "Select Service",
      description:
        "After the branch is selected, choose the banking service you need for that visit.",
      action: "Choose Service",
      icon: <AccountIcon />,
      href: buildBranchesUrl(role, params, "service-selection"),
    },
    {
      title: "Pick Date & Time",
      description:
        "Choose the date first, then pick an available time slot that fits your schedule.",
      action: "Pick Schedule",
      icon: <ClockIcon />,
      href: buildBranchesUrl(role, params, "schedule-selection"),
    },
    {
      title: "Confirm Booking",
      description:
        "Review your branch, service, date, and time, then complete the booking from the summary step.",
      action: "Review Booking",
      icon: <CheckIcon />,
      href: isConfirmed
        ? buildBookingsUrl(role, params)
        : buildBranchesUrl(role, params, "booking-summary"),
    },
  ];

  const serviceCards = [
    {
      title: "Savings / Current Account",
      description: "Open a Wing Bank savings or current account and get branch help with setup.",
      icon: <AccountIcon />,
      href: buildBranchesUrl(role, { branch: params.branch, service: "account" }, "schedule-selection"),
    },
    {
      title: "Personal Loan Consultation",
      description: "Book time with branch staff to discuss personal loan options and requirements.",
      icon: <LoanIcon />,
      href: buildBranchesUrl(role, { branch: params.branch, service: "loan" }, "schedule-selection"),
    },
    {
      title: "Debit / Card Services",
      description: "Get help with debit cards, CSS cards, and other card-related branch services.",
      icon: <BusinessIcon />,
      href: buildBranchesUrl(role, { branch: params.branch, service: "card" }, "schedule-selection"),
    },
    {
      title: "International Transfer Support",
      description: "Request branch support for international money transfer services.",
      icon: <WealthIcon />,
      href: buildBranchesUrl(role, { branch: params.branch, service: "transfer" }, "schedule-selection"),
    },
  ];

  const supportCards = [
    {
      title: "Booking Assistance",
      description:
        "Help for selecting a branch, choosing a service, or changing your appointment flow.",
      action: "Open Booking Flow",
      icon: <HelpIcon />,
      href: buildBranchesUrl(role, params, "branch-selection"),
    },
    {
      title: "Support Options",
      description:
        "Review the support section for branch questions, booking issues, and appointment follow-up.",
      action: "Review Support",
      icon: <PhoneIcon />,
      href: buildPortalUrl(role, params, "support"),
    },
    {
      title: "My Booking Status",
      description:
        "Open your booking page to review the selected branch, service, date, and confirmed appointment.",
      action: "View My Bookings",
      icon: <ChatIcon />,
      href: buildBookingsUrl(role, params),
    },
  ];

  const footerGroups = [
    {
      title: "Explore",
      links: [
        { label: "How It Works", href: buildPortalUrl(role, params, "services") },
        { label: "Branch Directory", href: buildBranchesUrl(role, params, "branch-selection") },
        { label: "My Bookings", href: buildBookingsUrl(role, params) },
      ],
    },
    {
      title: "Booking",
      links: [
        { label: "Choose a Branch", href: buildBranchesUrl(role, params, "branch-selection") },
        { label: "Select a Service", href: buildBranchesUrl(role, params, "service-selection") },
        { label: "Review Summary", href: buildBranchesUrl(role, params, "booking-summary") },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Booking Help", href: buildPortalUrl(role, params, "support") },
        { label: "Support Section", href: buildPortalUrl(role, params, "support") },
        { label: "Portal Home", href: buildPortalUrl(role, params) },
      ],
    },
  ];

  return (
    <>
      <section className="portal-hero" id="home">
        <div className="portal-copy">
          <p className="portal-kicker">Smart queueing</p>
          <h1>
            Skip the line with <span>Smart</span> Booking
          </h1>
          <p>
            Schedule your bank visit in seconds and enjoy priority service at any branch with
            secure digital booking.
          </p>

          <div className="portal-cta-row">
            <Link
              href={buildBranchesUrl(role, {}, "branch-selection")}
              className="portal-primary-button"
            >
              Book Now
            </Link>
            <Link href="/portal?role=customer#services" className="portal-secondary-button">
              View Flow
            </Link>
          </div>
        </div>

        <div className="portal-visual-shell">
          <div className="portal-visual">
            <div className="portal-wall" />
            <div className="portal-kiosk portal-kiosk-main">
              <div className="portal-kiosk-screen portal-kiosk-screen-dark" />
              <div className="portal-kiosk-screen portal-kiosk-screen-light" />
            </div>
            <div className="portal-kiosk portal-kiosk-side" />
            <div className="portal-totem portal-totem-left" />
            <div className="portal-totem portal-totem-right" />
            <div className="portal-floor" />
          </div>

          <div className="portal-status-card">
            <span className="portal-status-icon" aria-hidden="true">
              <PortalShieldIcon />
            </span>
            <div>
              <strong>Priority Access</strong>
              <p>Average wait time under 2 minutes at select branches.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-process-section" id="services">
        <PortalSectionHeader
          kicker="Process"
          title="Booking made simple"
          description="Scroll the homepage to understand the flow, then use the header to move through branch, service, time, and booking pages."
          variant="process"
        />

        <div className="portal-process-grid">
          {processCards.map((card) => (
            <article key={card.title} className="portal-process-card">
              <span className="portal-process-icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="portal-process-link">
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="portal-services-section">
        <PortalSectionHeader
          kicker="Services"
          title="Every service at your fingertips"
          description="Whether it is a quick deposit or a long-term mortgage consultation, explore services here and continue the booking flow from the header."
        />

        <div className="portal-services-body">
          <div className="portal-services-media">
            <div className="portal-media-card portal-media-card-teal">
              <div className="portal-media-scene portal-media-scene-cup">
                <span className="portal-hand" aria-hidden="true" />
                <span className="portal-cup" aria-hidden="true" />
              </div>
            </div>
            <div className="portal-media-card portal-media-card-accent">
              <div className="portal-media-icon" aria-hidden="true">
                <LoanIcon />
              </div>
            </div>
            <div className="portal-media-card portal-media-card-dark">
              <div className="portal-media-icon" aria-hidden="true">
                <WealthIcon />
              </div>
            </div>
            <div className="portal-media-card portal-media-card-photo">
              <div className="portal-card-hand" aria-hidden="true">
                <span className="portal-card-device" />
                <span className="portal-card-arm" />
              </div>
            </div>
          </div>

          <div className="portal-service-list">
            {serviceCards.map((service) => (
              <Link key={service.title} href={service.href} className="portal-service-item">
                <span className="portal-service-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <div>
                  <strong>{service.title}</strong>
                  <p>{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-final-section">
        <div className="portal-final-cta">
          <div className="portal-final-glow portal-final-glow-left" aria-hidden="true" />
          <div className="portal-final-glow portal-final-glow-right" aria-hidden="true" />
          <h2>Ready to reclaim your afternoon?</h2>
          <p>
            Join thousands of smart bankers who never wait in line. Your time is valuable, spend it
            wisely.
          </p>

          <div className="portal-final-actions">
            <Link
              href={buildBranchesUrl(role, {}, "branch-selection")}
              className="portal-primary-button"
            >
              Book Now
            </Link>
            <Link href="/portal?role=customer#support" className="portal-dark-button">
              Contact Support
            </Link>
          </div>
        </div>

        <section className="portal-support-shell" id="support">
          <PortalSectionHeader
            kicker="Support"
            title="Need help with your booking?"
            description="Get fast help for branch selection, service booking, date changes, and digital support."
            variant="support"
          />

          <div className="portal-support-grid">
            {supportCards.map((card) => (
              <article key={card.title} className="portal-support-card">
                <span className="portal-support-card-icon" aria-hidden="true">
                  {card.icon}
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link href={card.href} className="portal-support-link">
                  {card.action}
                </Link>
              </article>
            ))}
          </div>

          <div className="portal-support-panel">
            <div>
              <strong>What support should include</strong>
              <p>
                Branch location help, service guidance, booking issues, date and time changes,
                digital banking support, and escalation for urgent customer requests.
              </p>
            </div>
            <div className="portal-support-tags">
              <span>Branch help</span>
              <span>Service guidance</span>
              <span>Booking changes</span>
              <span>Queue support</span>
            </div>
          </div>
        </section>

        <footer className="portal-footer">
          <div className="portal-footer-brand">
            <div className="portal-footer-brand-row">
              <span className="portal-footer-badge" aria-hidden="true">
                <LightningIcon />
              </span>
              <strong>Wing Queue</strong>
            </div>
            <p>
              A branch booking and queue experience designed for faster customer service and clearer
              support access.
            </p>
            <div className="portal-footer-socials">
              <span className="portal-footer-social">G</span>
              <span className="portal-footer-social">W</span>
            </div>
          </div>

          <div className="portal-footer-links">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </footer>

        <div className="portal-footer-bottom">
          <p>Copyright 2024 SmartQ Technologies. All rights reserved.</p>
          <div>
            <span>English (US)</span>
            <span>USD</span>
          </div>
        </div>
      </section>
    </>
  );
}
