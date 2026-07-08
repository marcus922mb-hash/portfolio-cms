type Props = {
  basePrice: number | null;
  finalPrice: number | null;
};

export function EstimatePriceSummary({ basePrice, finalPrice }: Props) {
  const base = basePrice ?? 0;
  const final = finalPrice ?? 0;
  const diff = final - base;
  const hasDiff = diff !== 0 && base > 0;

  return (
    <div className="est-price-summary">
      <div className="est-price-row">
        <span className="est-price-label">Cena bazowa</span>
        <span className="est-price-value">{base.toLocaleString("pl-PL")} zł</span>
      </div>
      {hasDiff && (
        <div className="est-price-row">
          <span className="est-price-label">{diff > 0 ? "Dopłata" : "Rabat"}</span>
          <span className={`est-price-value ${diff < 0 ? "est-price-value--discount" : "est-price-value--surcharge"}`}>
            {diff > 0 ? "+" : ""}
            {diff.toLocaleString("pl-PL")} zł
          </span>
        </div>
      )}
      <div className="est-price-row est-price-row--final">
        <span className="est-price-label">Cena finalna</span>
        <span className="est-price-value est-price-value--final">
          {final.toLocaleString("pl-PL")} zł
        </span>
      </div>
    </div>
  );
}
