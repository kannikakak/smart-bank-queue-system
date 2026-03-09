import {
  filterCustomerServices,
  type ServiceCategoryId,
} from "../data/homepage";
import { CustomerIcon } from "./customer-icons";

type CustomerServiceShowcaseProps = {
  activeCategory: ServiceCategoryId;
  searchQuery: string;
};

function CustomerServiceArtwork({
  illustration,
}: {
  illustration: "savings" | "mortgage" | "business" | "wire";
}) {
  if (illustration === "savings") {
    return (
      <div className="customer-art customer-art-savings" aria-hidden="true">
        <span className="customer-art-tablet" />
        <span className="customer-art-hand" />
        <span className="customer-art-pencil" />
        <span className="customer-art-coin customer-art-coin-one" />
        <span className="customer-art-coin customer-art-coin-two" />
        <span className="customer-art-coin customer-art-coin-three" />
      </div>
    );
  }

  if (illustration === "mortgage") {
    return (
      <div className="customer-art customer-art-mortgage" aria-hidden="true">
        <span className="customer-art-paper" />
        <span className="customer-art-keyring" />
        <span className="customer-art-key customer-art-key-main" />
        <span className="customer-art-key customer-art-key-small" />
      </div>
    );
  }

  if (illustration === "business") {
    return (
      <div className="customer-art customer-art-business" aria-hidden="true">
        <span className="customer-art-jacket" />
        <span className="customer-art-shirt" />
        <span className="customer-art-laptop" />
      </div>
    );
  }

  return (
    <div className="customer-art customer-art-wire" aria-hidden="true">
      <span className="customer-art-stack customer-art-stack-one" />
      <span className="customer-art-stack customer-art-stack-two" />
      <span className="customer-art-stack customer-art-stack-three" />
      <span className="customer-art-stack customer-art-stack-four" />
    </div>
  );
}

export function CustomerServiceShowcase({
  activeCategory,
  searchQuery,
}: CustomerServiceShowcaseProps) {
  const visibleServices = filterCustomerServices(activeCategory, searchQuery);

  return (
    <section className="customer-showcase" aria-live="polite">
      {visibleServices.length ? (
        <div className="customer-service-grid">
          {visibleServices.map((service) => (
            <article className="customer-service-card" key={service.id}>
              <div className="customer-service-media">
                {service.badge ? (
                  <span className="customer-service-badge">{service.badge}</span>
                ) : null}
                <CustomerServiceArtwork illustration={service.illustration} />
              </div>

              <div className="customer-service-card-body">
                <div className="customer-service-title">
                  <div className="customer-service-icon">
                    <CustomerIcon name={service.icon} />
                  </div>
                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="customer-service-card-footer">
                  <div className="customer-service-duration">
                    <span>Expected duration</span>
                    <strong>
                      <CustomerIcon name="clock" />
                      {service.duration}
                    </strong>
                  </div>

                  <a className="customer-details-button" href="#locations">
                    Details
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="customer-empty-state">
          <strong>No services matched your search.</strong>
          <p>Try another keyword or switch back to All Services to see the full booking menu.</p>
        </div>
      )}
    </section>
  );
}
