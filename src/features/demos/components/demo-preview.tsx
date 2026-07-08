import { parseDemoContent, type Demo } from "@/features/demos/types";

export function DemoPreview({ demo }: { demo: Demo }) {
  const content = parseDemoContent(demo.content);
  return (
    <div className="demo-panel-preview">
      <div className="demo-panel-preview-bar">
        <span />
        <span />
        <span />
        <b>/demo/{demo.slug}</b>
      </div>
      <div className="demo-panel-preview-body">
        <p>{demo.industry === "handmade_jewelry" ? "Biżuteria handmade" : "Demo strony"}</p>
        <h3>{content.hero.title}</h3>
        <span>{content.hero.cta}</span>
      </div>
    </div>
  );
}
