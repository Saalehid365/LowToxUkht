const swaps = [
  { from: "Fragrance (parfum)", to: "Unscented, or pure essential oil" },
  { from: "Alcohol denat.", to: "Alcohol free formulas" },
  { from: "Gelatin, source not stated", to: "Plant based capsules" },
  { from: "PFAS non stick coating", to: "Cast iron and stainless steel" },
  { from: "Phthalates in plastic tubs", to: "Glass storage" },
  { from: "Optical brighteners", to: "Oxygen bleach and sunlight" },
];

// The one orchestrated moment on the site: each ingredient is struck through
// in turn and its replacement is written in beside it.
export function LabelHero() {
  return (
    <figure className="label" aria-label="Examples of common household ingredients and what replaces them">
      <figcaption className="label-head">
        <span className="label-title">Contents of an ordinary home</span>
        <span className="label-sub">Read before use</span>
      </figcaption>
      <ol className="label-rows">
        {swaps.map((s, i) => (
          <li key={s.from} style={{ "--i": i } as React.CSSProperties}>
            <s className="label-from">{s.from}</s>
            <span className="label-to">{s.to}</span>
          </li>
        ))}
      </ol>
      <p className="label-foot">Checked for toxins, allergens and halal ingredients.</p>
    </figure>
  );
}
