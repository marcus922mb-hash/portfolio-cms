import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getWordPressConnectionById,
  getWordPressConnectionActivity,
  getWordPressConnectionRawById,
} from "@/features/wordpress/queries/wordpress-queries";
import { WordPressConnectionDetails } from "@/features/wordpress/components/wordpress-connection-details";
import { buildWordPressClient } from "@/lib/wordpress/client";
import { decryptPassword, isEncryptionAvailable } from "@/lib/wordpress/encryption";
import type { WPPage, WPPost, WPMedia } from "@/lib/wordpress/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getWordPressConnectionById(id);
  if (!data) return { title: "Połączenie nie znalezione" };
  return { title: data.name || data.site_url };
}

export default async function WPConnectionDetailsPage({ params }: Props) {
  const { id } = await params;

  const [{ data: connection, error }, { data: activity }, raw] = await Promise.all([
    getWordPressConnectionById(id),
    getWordPressConnectionActivity(id),
    getWordPressConnectionRawById(id),
  ]);

  if (error || !connection) notFound();

  let pages: WPPage[] | null = null;
  let posts: WPPost[] | null = null;
  let media: WPMedia[] | null = null;
  let wpError: string | null = null;

  if (connection.status === "connected" && raw) {
    let decryptedPassword: string | null = null;
    if (raw.application_password_encrypted && isEncryptionAvailable()) {
      try {
        decryptedPassword = decryptPassword(raw.application_password_encrypted);
      } catch {
        // continue without password
      }
    }

    const client = buildWordPressClient({
      site_url: raw.site_url,
      api_base_url: raw.api_base_url,
      username: raw.username,
      decryptedPassword,
    });

    const [pagesRes, postsRes, mediaRes] = await Promise.all([
      client.getPages(8),
      client.getPosts(8),
      client.getMedia(8),
    ]);

    if (pagesRes.success) pages = pagesRes.data;
    if (postsRes.success) posts = postsRes.data;
    if (mediaRes.success) media = mediaRes.data;

    if (!pagesRes.success || !postsRes.success) {
      wpError = !pagesRes.success ? pagesRes.error : (postsRes.success ? null : postsRes.error);
    }
  }

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/wordpress" className="crm-back-link">
            <ChevronLeft size={13} />
            WordPress
          </Link>
          <h1 className="crm-page-title">{connection.name || connection.site_url}</h1>
          {connection.site_url && (
            <p className="crm-page-desc">{connection.site_url}</p>
          )}
        </div>
      </div>

      <WordPressConnectionDetails
        connection={connection}
        activity={activity}
        pages={pages}
        posts={posts}
        media={media}
        wpError={wpError}
      />
    </>
  );
}
