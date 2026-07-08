export type WPSiteInfo = {
  name: string;
  description: string;
  url: string;
  home: string;
  gmt_offset: number;
  timezone_string: string;
  namespaces: string[];
};

export type WPPage = {
  id: number;
  date: string;
  link: string;
  slug: string;
  status: string;
  title: { rendered: string };
};

export type WPPost = {
  id: number;
  date: string;
  link: string;
  slug: string;
  status: string;
  title: { rendered: string };
  excerpt: { rendered: string };
};

export type WPMedia = {
  id: number;
  date: string;
  link: string;
  source_url: string;
  media_type: string;
  mime_type: string;
  title: { rendered: string };
};

export type WPFetchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type WPConnectionTestResult = {
  success: boolean;
  siteName?: string;
  siteUrl?: string;
  error?: string;
};
