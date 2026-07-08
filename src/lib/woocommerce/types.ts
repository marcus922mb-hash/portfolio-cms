export type WooCommerceCredentials = {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
};

export type WooCommerceStoreInfo = {
  name: string;
  description: string | null;
  url: string;
};

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  status: string;
  type: string;
  price: string | null;
  permalink: string;
  imageUrl: string | null;
  stockStatus: string | null;
};

export type WooCommerceCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type WooCommerceOrder = {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string | null;
  dateCreated: string | null;
  customerName: string;
};

export type WooCommerceConnectionTestResult = {
  testedAt: string;
  store: WooCommerceStoreInfo;
  products: WooCommerceProduct[];
  categories: WooCommerceCategory[];
  orders: WooCommerceOrder[];
};
