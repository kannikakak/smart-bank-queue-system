"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createAdminService,
  getAdminBranches,
  getAdminOverview,
  getAdminServices,
  updateAdminService,
  type AdminBranchSummary,
  type AdminOverview,
  type AdminServicePayload,
  type AdminServiceSummary,
} from "@/shared/lib/api";

function ServiceBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16v10H4V7Zm2 2v6h12V9H6Zm4-6h4v2h-4V3Z" fill="currentColor" />
    </svg>
  );
}

function formatClock(value: string) {
  return value.slice(0, 5);
}

function toPayload(service: AdminServiceSummary): AdminServicePayload {
  return {
    name: service.name,
    durationMinutes: service.durationMinutes,
    active: service.active,
  };
}

function hasServiceChanges(left: AdminServiceSummary[], right: AdminServiceSummary[]) {
  return JSON.stringify(left.map(toPayload)) !== JSON.stringify(right.map(toPayload));
}

export function AdminServicesWorkspace() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [branches, setBranches] = useState<AdminBranchSummary[]>([]);
  const [services, setServices] = useState<AdminServiceSummary[]>([]);
  const [draftServices, setDraftServices] = useState<AdminServiceSummary[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newService, setNewService] = useState<AdminServicePayload>({
    name: "",
    durationMinutes: 30,
    active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("Service configuration is synced.");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [overviewResponse, branchResponse, servicesResponse] = await Promise.all([
          getAdminOverview(),
          getAdminBranches(),
          getAdminServices(),
        ]);

        if (!isMounted) {
          return;
        }

        setOverview(overviewResponse);
        setBranches(branchResponse);
        setServices(servicesResponse);
        setDraftServices(servicesResponse);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to load service configuration data.",
        );
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const primaryBranch = branches[0] ?? null;
  const activeServices = draftServices.filter((service) => service.active);
  const averageDuration = activeServices.length
    ? Math.round(activeServices.reduce((total, service) => total + service.durationMinutes, 0) / activeServices.length)
    : 0;
  const slotGap = Math.min(30, Math.max(10, Math.round(averageDuration / 4 / 5) * 5));
  const maxDailyCapacity = Math.max(
    12,
    (Number(overview?.metrics.activeStaff ?? "0") || 1) * Math.max(4, Math.round(420 / Math.max(averageDuration + slotGap, 20))),
  );
  const hasUnsavedChanges = hasServiceChanges(services, draftServices);

  const optimizationSummary = useMemo(() => {
    if (activeServices.length === 0) {
      return "No active services. Enable at least one branch service to generate slot guidance.";
    }

    return `The current mix of ${activeServices.length} active services suggests an average gap of ${slotGap} minutes between slots.`;
  }, [activeServices.length, slotGap]);

  function updateDraftService(serviceId: number, updater: (service: AdminServiceSummary) => AdminServiceSummary) {
    setDraftServices((current) =>
      current.map((service) => (service.id === serviceId ? updater(service) : service)),
    );
  }

  async function handleSaveConfiguration() {
    const changedServices = draftServices.filter((service, index) => {
      const original = services[index];
      return !original || JSON.stringify(toPayload(service)) !== JSON.stringify(toPayload(original));
    });

    if (changedServices.length === 0) {
      setActionMessage("No service changes to save.");
      return;
    }

    setIsSaving(true);

    try {
      const updated = await Promise.all(
        changedServices.map((service) => updateAdminService(service.id, toPayload(service))),
      );

      const updatedById = new Map(updated.map((service) => [service.id, service]));
      const nextServices = draftServices.map((service) => updatedById.get(service.id) ?? service);
      setServices(nextServices);
      setDraftServices(nextServices);
      setActionMessage(`Saved ${updated.length} service configuration change${updated.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setActionMessage(
        error instanceof Error && error.message ? error.message : "Unable to save service configuration.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateService() {
    if (newService.name.trim().length < 3) {
      setActionMessage("Service name must be at least 3 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const createdService = await createAdminService({
        ...newService,
        name: newService.name.trim(),
      });
      const nextServices = [...draftServices, createdService].sort((left, right) => left.name.localeCompare(right.name));
      setServices(nextServices);
      setDraftServices(nextServices);
      setNewService({ name: "", durationMinutes: 30, active: true });
      setShowCreateForm(false);
      setActionMessage(`${createdService.name} was added to the branch catalog.`);
    } catch (error) {
      setActionMessage(
        error instanceof Error && error.message ? error.message : "Unable to create a new service.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="admin-system-page admin-modern-page">
      {loadError ? (
        <p className="auth-error-message" aria-live="polite">
          {loadError}
        </p>
      ) : null}

      <header className="admin-modern-hero">
        <div className="admin-modern-hero-copy">
          <p className="admin-system-kicker">Central Hub • Service Configuration</p>
          <h2>Service Configuration</h2>
          <p className="admin-system-hero-description">
            Manage branch offerings with cleaner controls, smaller signals, and a working save flow behind each service card.
          </p>
        </div>

        <div className="admin-modern-toolbar">
          <button
            type="button"
            className="admin-table-action"
            onClick={() => {
              setDraftServices(services);
              setActionMessage("Unsaved service edits were discarded.");
            }}
            disabled={!hasUnsavedChanges || isSaving}
          >
            Discard Changes
          </button>

          <button
            type="button"
            className="admin-analytics-export"
            onClick={() => void handleSaveConfiguration()}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </header>

      <section className="admin-modern-grid admin-modern-grid-services">
        <article className="admin-modern-panel admin-modern-services-panel">
          <div className="admin-modern-panel-head">
            <div>
              <h3>Active Services</h3>
              <p>{activeServices.length} available services</p>
            </div>
          </div>

          <div className="admin-modern-service-grid">
            {draftServices.map((service) => (
              <article key={service.id} className="admin-modern-service-card">
                <div className="admin-modern-service-head">
                  <span className="admin-modern-metric-icon is-green">
                    <ServiceBadgeIcon />
                  </span>
                  <label className="admin-modern-switch">
                    <input
                      type="checkbox"
                      checked={service.active}
                      onChange={(event) => {
                        updateDraftService(service.id, (current) => ({
                          ...current,
                          active: event.target.checked,
                        }));
                        setActionMessage(`${service.name} marked ${event.target.checked ? "active" : "inactive"}.`);
                      }}
                    />
                    <span />
                  </label>
                </div>

                <div className="admin-modern-service-copy">
                  <strong>{service.name}</strong>
                  <p>
                    {service.active
                      ? "Available to customers for branch scheduling."
                      : "Hidden from customer appointment booking until re-enabled."}
                  </p>
                </div>

                <div className="admin-modern-duration-editor">
                  <span>Avg. Duration</span>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftService(service.id, (current) => ({
                          ...current,
                          durationMinutes: Math.max(15, current.durationMinutes - 5),
                        }))
                      }
                    >
                      -
                    </button>
                    <strong>{service.durationMinutes} min</strong>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftService(service.id, (current) => ({
                          ...current,
                          durationMinutes: Math.min(120, current.durationMinutes + 5),
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <article className="admin-modern-service-card is-dashed">
              {showCreateForm ? (
                <div className="admin-modern-create-form">
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(event) =>
                      setNewService((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Service name"
                  />
                  <input
                    type="number"
                    min={15}
                    max={120}
                    step={5}
                    value={newService.durationMinutes}
                    onChange={(event) =>
                      setNewService((current) => ({
                        ...current,
                        durationMinutes: Number(event.target.value) || 30,
                      }))
                    }
                    placeholder="Duration"
                  />
                  <div className="admin-modern-create-actions">
                    <button type="button" className="admin-table-action" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                    <button type="button" className="admin-analytics-export" onClick={() => void handleCreateService()}>
                      Add Service
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="admin-modern-add-service"
                  onClick={() => setShowCreateForm(true)}
                >
                  <span>+</span>
                  Add Service
                </button>
              )}
            </article>
          </div>
        </article>

        <aside className="admin-modern-side-stack">
          <article className="admin-modern-panel">
            <div className="admin-modern-panel-head">
              <div>
                <h3>Branch Operations</h3>
                <p>Live branch interval guidance.</p>
              </div>
            </div>

            <div className="admin-modern-ops-card-list">
              <div className="admin-modern-ops-item">
                <strong>Working Hours</strong>
                <span>
                  {primaryBranch ? `${formatClock(primaryBranch.openTime)} - ${formatClock(primaryBranch.closeTime)}` : "09:00 - 18:00"}
                </span>
              </div>

              <div className="admin-modern-ops-item">
                <strong>Time Slot Gap</strong>
                <span>{slotGap} min</span>
              </div>

              <div className="admin-modern-ops-item">
                <strong>Max Daily Capacity</strong>
                <span>{maxDailyCapacity}</span>
              </div>

              <button
                type="button"
                className="admin-table-action"
                onClick={() => setActionMessage("Branch operation logs opened for review.")}
              >
                View Operation Logs
              </button>
            </div>
          </article>

          <article className="admin-modern-panel">
            <div className="admin-modern-panel-head">
              <div>
                <h3>Optimization Engine</h3>
                <p>Dynamic slot recommendation.</p>
              </div>
            </div>

            <div className="admin-modern-optimization-card">
              <div className="admin-modern-optimization-stat">
                <span>Throughput</span>
                <strong>+{Math.max(6, Math.round(activeServices.length * 3.1))}%</strong>
              </div>
              <div className="admin-modern-optimization-stat">
                <span>Avg Wait</span>
                <strong>-{Math.max(4, Math.round(slotGap / 2))}m</strong>
              </div>
              <p>{optimizationSummary}</p>
            </div>
          </article>
        </aside>
      </section>

      <p className="admin-analytics-feedback" aria-live="polite">
        {actionMessage}
      </p>
    </section>
  );
}
