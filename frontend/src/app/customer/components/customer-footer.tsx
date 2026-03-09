import { CustomerIcon } from "./customer-icons";
import { footerColumns } from "../data/homepage";

export function CustomerFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="customer-footer" id="support">
      <div className="customer-footer-grid">
        <div className="customer-footer-brand">
          <div className="customer-footer-lockup">
            <div className="customer-nav-brand-icon">
              <CustomerIcon name="bank" />
            </div>
            <strong>SmartQ</strong>
          </div>
          <p>
            Making banking smarter, one queue at a time. Book your appointment and skip the wait.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="customer-footer-bottom">
        <span>&copy; {currentYear} SmartQ Financial Services. All rights reserved.</span>
      </div>
    </footer>
  );
}
