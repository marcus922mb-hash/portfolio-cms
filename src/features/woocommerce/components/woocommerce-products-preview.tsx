import type { WooCommerceCategory, WooCommerceProduct } from "@/lib/woocommerce/types";

type Props = {
  products: WooCommerceProduct[];
  categories: WooCommerceCategory[];
  error?: string | null;
};

export function WooCommerceProductsPreview({ products, categories, error }: Props) {
  if (error) {
    return <p className="crm-placeholder-text">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="crm-placeholder-text">Brak produktów do podglądu. Uruchom test połączenia WooCommerce.</p>;
  }

  return (
    <div className="woocommerce-preview-grid">
      <div className="woocommerce-preview-block">
        <h3 className="woocommerce-preview-heading">Ostatnie produkty</h3>
        <div className="woocommerce-product-list">
          {products.map((product) => (
            <article key={product.id} className="woocommerce-product-card">
              <div className="woocommerce-product-media">
                <span>{product.imageUrl ? "Zdjęcie produktu" : "Brak zdjęcia"}</span>
              </div>
              <div className="woocommerce-product-copy">
                <strong>{product.name}</strong>
                <p>{product.price ? `${product.price} zł` : "Brak ceny"}</p>
                <span>{product.status} · {product.stockStatus ?? "stock?"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="woocommerce-preview-block">
        <h3 className="woocommerce-preview-heading">Kategorie</h3>
        {categories.length === 0 ? (
          <p className="crm-placeholder-text">Brak kategorii do podglądu.</p>
        ) : (
          <div className="woocommerce-category-list">
            {categories.map((category) => (
              <span key={category.id} className="woocommerce-category-chip">
                {category.name} <i>{category.count}</i>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
