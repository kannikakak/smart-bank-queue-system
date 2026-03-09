import {
  serviceAvailabilityLabel,
  serviceFilters,
  type ServiceCategoryId,
} from "../data/homepage";

type CustomerProcessProps = {
  activeCategory: ServiceCategoryId;
  resultCount: number;
  onCategoryChange: (category: ServiceCategoryId) => void;
};

export function CustomerProcess({
  activeCategory,
  resultCount,
  onCategoryChange,
}: CustomerProcessProps) {
  return (
    <section className="customer-service-toolbar" id="services">
      <div className="customer-service-toolbar-copy">
        <span className="customer-section-label">Service Menu</span>
        <h2>Choose the appointment that fits your visit.</h2>
        <p>Book everyday banking, loan consultations, and business services from one place.</p>
      </div>

      <div className="customer-service-toolbar-controls">
        <div className="customer-filter-row" aria-label="Service categories" role="tablist">
          {serviceFilters.map((filter) => (
            <button
              aria-selected={filter.id === activeCategory}
              className={
                filter.id === activeCategory
                  ? "customer-filter-chip active"
                  : "customer-filter-chip"
              }
              key={filter.id}
              onClick={() => onCategoryChange(filter.id)}
              role="tab"
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>

        <span className="customer-service-count">
          {resultCount} {serviceAvailabilityLabel}
        </span>
      </div>
    </section>
  );
}
