import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function NowaDemoAliasPage({ searchParams }: Props) {
  const params = new URLSearchParams();
  const entries = await searchParams;
  for (const [key, value] of Object.entries(entries)) {
    if (value) params.set(key, value);
  }
  redirect(`/panel/demo/nowe${params.size ? `?${params.toString()}` : ""}`);
}
