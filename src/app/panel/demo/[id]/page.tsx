import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { DemoDetailsCard } from "@/features/demos/components/demo-details-card";
import { getDemoActivity, getDemoById, getDemoEmailLogs } from "@/features/demos/queries/demo-queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getDemoById(id);
  return { title: data ? data.title : "Demo nie znalezione" };
}

export default async function DemoDetailsPage({ params }: Props) {
  const { id } = await params;
  const [{ data: demo }, { data: activity }, { data: emailLogs }] = await Promise.all([
    getDemoById(id),
    getDemoActivity(id),
    getDemoEmailLogs(id),
  ]);

  if (!demo) notFound();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/demo" className="crm-back-link">
            <ChevronLeft size={13} />
            Demo
          </Link>
          <h1 className="crm-page-title">Szczegóły demo</h1>
          <p className="crm-page-desc">{demo.title}</p>
        </div>
      </div>

      <DemoDetailsCard demo={demo} activity={activity} emailLogs={emailLogs} />
    </>
  );
}
