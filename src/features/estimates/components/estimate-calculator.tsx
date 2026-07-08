import type { PriceBreakdownItem } from "@/config/pricing";

type Props = {
  breakdown: PriceBreakdownItem[];
  basePrice: number;
  finalPrice: number;
};

export function EstimateCalculator({ breakdown, basePrice, finalPrice }: Props) {
  const diff = finalPrice - basePrice;
  const hasDiff = diff !== 0;

  return (
    <div className="est-calc">
      <div className="est-calc-breakdown">
        {breakdown.map((item, i) => (
          <div key={i} className="est-calc-row">
            <span className="est-calc-label">{item.label}</span>
            <span className="est-calc-price">{item.price.toLocaleString("pl-PL")} zł</span>
          </div>
        ))}
      </div>
      <div className="est-calc-footer">
        <div className="est-calc-row est-calc-row--base">
          <span className="est-calc-label">Cena bazowa</span>
          <span className="est-calc-price est-calc-price--base">
            {basePrice.toLocaleString("pl-PL")} zł
          </span>
        </div>
        {hasDiff && (
          <div className="est-calc-row">
            <span className="est-calc-label est-calc-label--muted">
              {diff > 0 ? "Dopłata" : "Rabat"}
            </span>
            <span className={`est-calc-price ${diff < 0 ? "est-calc-price--discount" : "est-calc-price--surcharge"}`}>
              {diff > 0 ? "+" : ""}
              {diff.toLocaleString("pl-PL")} zł
            </span>
          </div>
        )}
        <div className="est-calc-row est-calc-row--final">
          <span className="est-calc-label">Cena finalna</span>
          <span className="est-calc-price est-calc-price--final">
            {finalPrice.toLocaleString("pl-PL")} zł
          </span>
        </div>
      </div>
    </div>
  );
}
