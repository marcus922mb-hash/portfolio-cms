import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getEstimateById,
  getEstimateActivity,
} from "@/features/estimates/queries/estimate-queries";
import { EstimateDetailsCard } from "@/features/estimates/components/estimate-details-card";
import { getDemosByEstimateId } from "@/features/demos/queries/demo-queries";

export const metadata: Metadata = { title: "Szczegóły wyceny" };

type Props = {
  params: Promise<{ id: string }>;
};

const ACTIVITY_LABELS: Record<string, string> = {
  created: "Utworzono wycenę",
  updated: "Zaktualizowano wycenę",
  status_changed: "Zmieniono status",
  price_changed: "Zmieniono cenę",
};

export default async function WycenaDetailsPage({ params }: Props) {
  const { id } = await params;

  const [{ data: estimate }, { data: activity }, { data: demos }] = await Promise.all([
    getEstimateById(id),
    getEstimateActivity(id),
    getDemosByEstimateId(id),
  ]);

  if (!estimate) notFound();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/wyceny" className="crm-back-link">
            <ChevronLeft size={14} />
            Wyceny
          </Link>
          <h1 className="crm-page-title" style={{ marginTop: ".4rem" }}>Szczegóły wyceny</h1>
        </div>
      </div>

      <EstimateDetailsCard estimate={estimate} demos={demos ?? []} />

      {/* Historia aktywności */}
      {activity.length > 0 && (
        <div className="panel-card" style={{ marginTop: "1.5rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Historia aktywności</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-activity-list">
              {activity.map((log) => (
                <div key={log.id} className="crm-activity-item">
                  <div className="crm-activity-dot" />
                  <div>
                    <p className="crm-activity-label">
                      {ACTIVITY_LABELS[log.action] ?? log.action}
                    </p>
                    {log.description && (
                      <p className="crm-activity-desc">{log.description}</p>
                    )}
                    <p className="crm-activity-time">
                      {new Date(log.created_at).toLocaleString("pl-PL")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
