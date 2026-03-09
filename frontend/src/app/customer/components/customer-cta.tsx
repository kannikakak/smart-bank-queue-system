import { preBookingChecklist } from "../data/homepage";
import { CustomerIcon } from "./customer-icons";

export function CustomerCta() {
  return (
    <section className="customer-cta" id="locations">
      <div className="customer-cta-card">
        <div className="customer-cta-copy">
          <span className="customer-section-label">Visit Prep</span>
          <h2>Before you book...</h2>
          <p>
            Ensure you have the following documents ready to make your visit as smooth as
            possible. Most services require these items for verification.
          </p>

          <ul className="customer-checklist">
            {preBookingChecklist.map((item) => (
              <li key={item}>
                <span className="customer-checklist-icon">
                  <CustomerIcon name="check-circle" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="customer-cta-visual" aria-hidden="true">
          <div className="customer-cta-note">
            <strong>Fastest branch today</strong>
            <span>Riverside Office</span>
            <p>Walk-ins are averaging 9 minutes, or reserve a slot and skip the queue entirely.</p>
          </div>

          <div className="customer-cta-visual-inner">
            <CustomerIcon name="clipboard" />
          </div>
        </div>
      </div>
    </section>
  );
}
