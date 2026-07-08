import type { WooCommerceOrder } from "@/lib/woocommerce/types";

type Props = {
  orders: WooCommerceOrder[];
  error?: string | null;
};

export function WooCommerceOrdersPreview({ orders, error }: Props) {
  if (error) {
    return <p className="crm-placeholder-text">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="crm-placeholder-text">Brak ostatnich zamówień. To może oznaczać nowy sklep albo brak danych testowych.</p>;
  }

  return (
    <div className="woocommerce-orders-list">
      {orders.map((order) => (
        <div key={order.id} className="woocommerce-order-row">
          <div>
            <strong>#{order.number}</strong>
            <p>{order.customerName}</p>
          </div>
          <div className="woocommerce-order-meta">
            <span>{order.total} {order.currency ?? ""}</span>
            <small>{order.status}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
