"use client";

import { useBuilderStore } from "@/features/builder/store/builder-store";
import { getPropSchema } from "@/lib/builder/component-definitions";
import type { PropField, PropsTab } from "@/features/builder/types";
import { Settings2, Type, Zap, Eye, PlusCircle, Trash2, Upload } from "lucide-react";

// ── Generic field renderer ────────────────────────────────────
function PropFieldInput({
  field,
  value,
  onChange,
}: {
  field: Omit<PropField, "itemFields">;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const strVal = value == null ? "" : String(value);

  switch (field.type) {
    case "text":
      return (
        <input
          className="bldr-prop-input"
          value={strVal}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "image":
      return (
        <div className="bldr-image-input">
          <input
            className="bldr-prop-input"
            value={strVal}
            placeholder={field.placeholder || "URL obrazu"}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="bldr-image-upload">
            <Upload size={12} />
            Podmień obraz
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onChange(String(reader.result ?? ""));
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      );
    case "textarea":
      return (
        <textarea
          className="bldr-prop-textarea"
          value={strVal}
          placeholder={field.placeholder || ""}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          className="bldr-prop-input"
          type="number"
          value={strVal}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "color":
      return (
        <div className="bldr-prop-color-row">
          <input
            type="color"
            className="bldr-prop-color-swatch"
            value={strVal || "#000000"}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            className="bldr-prop-input bldr-prop-input--mono"
            value={strVal}
            placeholder="#000000"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "boolean":
      return (
        <label className="bldr-prop-toggle">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="bldr-prop-toggle-track">
            <span className="bldr-prop-toggle-thumb" />
          </span>
          <span className="bldr-prop-toggle-label">{Boolean(value) ? "Włączone" : "Wyłączone"}</span>
        </label>
      );
    case "select":
      return (
        <select
          className="bldr-prop-select"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    default:
      return null;
  }
}

// ── List field (items, links, columns…) ──────────────────────
function ListFieldEditor({
  field,
  value,
  onChange,
}: {
  field: PropField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items = (Array.isArray(value) ? value : []) as Record<string, unknown>[];

  function updateItem(i: number, key: string, val: unknown) {
    const next = items.map((item, idx) => idx === i ? { ...item, [key]: val } : item);
    onChange(next);
  }

  function addItem() {
    const blank: Record<string, unknown> = {};
    field.itemFields?.forEach((f) => { blank[f.key] = ""; });
    onChange([...items, blank]);
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="bldr-prop-list">
      {items.map((item, i) => (
        <div key={i} className="bldr-prop-list-item">
          <div className="bldr-prop-list-item-header">
            <span className="bldr-prop-list-item-num">{i + 1}</span>
            <button className="bldr-prop-list-delete" onClick={() => removeItem(i)}>
              <Trash2 size={11} />
            </button>
          </div>
          {field.itemFields?.map((subField) => (
            <div key={subField.key} className="bldr-prop-group">
              <label className="bldr-prop-label">{subField.label}</label>
              <PropFieldInput
                field={subField}
                value={item[subField.key]}
                onChange={(v) => updateItem(i, subField.key, v)}
              />
            </div>
          ))}
        </div>
      ))}
      <button className="bldr-prop-add-item" onClick={addItem}>
        <PlusCircle size={12} /> Dodaj element
      </button>
    </div>
  );
}

// ── Content tab ───────────────────────────────────────────────
function ContentTab({ id }: { id: string }) {
  const { components, updateProps } = useBuilderStore();
  const component = components.find((c) => c.id === id);
  if (!component) return null;

  const schema = getPropSchema(component.type);
  if (!schema) {
    return <p className="bldr-prop-empty">Brak edytowalnych właściwości dla tego komponentu.</p>;
  }

  return (
    <div className="bldr-prop-fields">
      {schema.fields.map((field) => (
        <div key={field.key} className="bldr-prop-group">
          <label className="bldr-prop-label">{field.label}</label>
          {field.type === "list" ? (
            <ListFieldEditor
              field={field}
              value={component.props[field.key]}
              onChange={(v) => updateProps(id, { [field.key]: v })}
            />
          ) : (
            <PropFieldInput
              field={field}
              value={component.props[field.key]}
              onChange={(v) => updateProps(id, { [field.key]: v })}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Style tab ─────────────────────────────────────────────────
function StyleTab({ id }: { id: string }) {
  const { components, updateStyles } = useBuilderStore();
  const component = components.find((c) => c.id === id);
  if (!component) return null;
  const s = component.styles;

  const colorRow = (label: string, key: "background" | "color") => (
    <div className="bldr-prop-group">
      <label className="bldr-prop-label">{label}</label>
      <div className="bldr-prop-color-row">
        <input
          type="color"
          className="bldr-prop-color-swatch"
          value={s[key] || "#ffffff"}
          onChange={(e) => updateStyles(id, { [key]: e.target.value })}
        />
        <input
          className="bldr-prop-input bldr-prop-input--mono"
          value={s[key] || ""}
          placeholder="#ffffff"
          onChange={(e) => updateStyles(id, { [key]: e.target.value })}
        />
      </div>
    </div>
  );

  const spacingRow = (label: string, key: keyof typeof s) => (
    <div className="bldr-prop-group">
      <label className="bldr-prop-label">{label}</label>
      <input
        className="bldr-prop-input"
        value={(s[key] as string) || ""}
        placeholder="np. 4rem, 64px"
        onChange={(e) => updateStyles(id, { [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="bldr-prop-fields">
      <div className="bldr-prop-section-label">Kolory</div>
      {colorRow("Tło", "background")}
      {colorRow("Kolor tekstu", "color")}

      <div className="bldr-prop-section-label">Padding (wewnętrzny)</div>
      {spacingRow("Góra", "paddingTop")}
      {spacingRow("Dół", "paddingBottom")}
      {spacingRow("Lewo", "paddingLeft")}
      {spacingRow("Prawo", "paddingRight")}

      <div className="bldr-prop-section-label">Margin (zewnętrzny)</div>
      {spacingRow("Góra", "marginTop")}
      {spacingRow("Dół", "marginBottom")}

      <div className="bldr-prop-section-label">Inne</div>
      {spacingRow("Minimalna wysokość", "minHeight")}
      {spacingRow("Zaokrąglenie", "borderRadius")}

      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Wyrównanie tekstu</label>
        <select
          className="bldr-prop-select"
          value={s.textAlign || "left"}
          onChange={(e) => updateStyles(id, { textAlign: e.target.value as "left" | "center" | "right" })}
        >
          <option value="left">Lewo</option>
          <option value="center">Środek</option>
          <option value="right">Prawo</option>
        </select>
      </div>

      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Tło – obrazek (URL)</label>
        <input
          className="bldr-prop-input"
          value={s.backgroundImage || ""}
          placeholder="https://..."
          onChange={(e) => updateStyles(id, { backgroundImage: e.target.value })}
        />
      </div>
    </div>
  );
}

// ── Animations tab ────────────────────────────────────────────
function AnimationsTab({ id }: { id: string }) {
  const { components, updateAnimations } = useBuilderStore();
  const component = components.find((c) => c.id === id);
  if (!component) return null;
  const a = component.animations;

  return (
    <div className="bldr-prop-fields">
      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Animacja wejścia</label>
        <select
          className="bldr-prop-select"
          value={a.type}
          onChange={(e) => updateAnimations(id, { type: e.target.value as typeof a.type })}
        >
          <option value="none">Brak</option>
          <option value="fadeIn">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="slideLeft">Slide Left</option>
          <option value="slideRight">Slide Right</option>
          <option value="zoomIn">Zoom In</option>
          <option value="reveal">Reveal</option>
          <option value="parallax">Parallax</option>
          <option value="bounce">Bounce</option>
          <option value="flip">Flip</option>
          <option value="stagger">Stagger</option>
          <option value="float">Float</option>
          <option value="pulse">Pulse</option>
          <option value="blur">Blur</option>
          <option value="elastic">Elastic</option>
          <option value="typewriter">Typewriter</option>
        </select>
      </div>
      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Czas trwania (ms)</label>
        <input
          className="bldr-prop-input"
          type="number"
          value={a.duration}
          onChange={(e) => updateAnimations(id, { duration: Number(e.target.value) })}
        />
      </div>
      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Opóźnienie (ms)</label>
        <input
          className="bldr-prop-input"
          type="number"
          value={a.delay}
          onChange={(e) => updateAnimations(id, { delay: Number(e.target.value) })}
        />
      </div>
      <div className="bldr-prop-group">
        <label className="bldr-prop-label">Easing</label>
        <select
          className="bldr-prop-select"
          value={a.easing}
          onChange={(e) => updateAnimations(id, { easing: e.target.value })}
        >
          <option value="ease-out">ease-out</option>
          <option value="ease-in">ease-in</option>
          <option value="ease-in-out">ease-in-out</option>
          <option value="linear">linear</option>
        </select>
      </div>
    </div>
  );
}

// ── Visibility tab ────────────────────────────────────────────
function VisibilityTab({ id }: { id: string }) {
  const { components, updateVisibility } = useBuilderStore();
  const component = components.find((c) => c.id === id);
  if (!component) return null;
  const v = component.visibility;

  const row = (label: string, key: keyof typeof v) => (
    <div className="bldr-prop-group">
      <label className="bldr-prop-label">{label}</label>
      <label className="bldr-prop-toggle">
        <input
          type="checkbox"
          checked={v[key]}
          onChange={(e) => updateVisibility(id, { [key]: e.target.checked })}
        />
        <span className="bldr-prop-toggle-track">
          <span className="bldr-prop-toggle-thumb" />
        </span>
        <span className="bldr-prop-toggle-label">{v[key] ? "Widoczny" : "Ukryty"}</span>
      </label>
    </div>
  );

  return (
    <div className="bldr-prop-fields">
      {row("Desktop", "desktop")}
      {row("Tablet", "tablet")}
      {row("Mobile", "mobile")}
    </div>
  );
}

// ── Main properties panel ─────────────────────────────────────
const TABS: { key: PropsTab; label: string; Icon: React.ElementType }[] = [
  { key: "content", label: "Treść", Icon: Type },
  { key: "style", label: "Styl", Icon: Settings2 },
  { key: "animations", label: "Animacje", Icon: Zap },
  { key: "visibility", label: "Widoczność", Icon: Eye },
];

export function BuilderProperties() {
  const { selectedId, components, propsTab, setPropsTab } = useBuilderStore();
  const component = components.find((c) => c.id === selectedId);

  if (!component) {
    return (
      <aside className="bldr-props">
        <div className="bldr-props-empty">
          <Settings2 size={28} strokeWidth={1.2} style={{ opacity: .2, display: "block", margin: "0 auto .75rem" }} />
          <p>Kliknij komponent<br />aby edytować właściwości</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bldr-props">
      {/* Header */}
      <div className="bldr-props-header">
        <span className="bldr-props-label">{component.label}</span>
        <span className="bldr-props-type">{component.type}</span>
      </div>

      {/* Tabs */}
      <div className="bldr-props-tabs">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`bldr-props-tab${propsTab === key ? " bldr-props-tab--active" : ""}`}
            onClick={() => setPropsTab(key)}
            title={label}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bldr-props-body">
        {propsTab === "content" && <ContentTab id={component.id} />}
        {propsTab === "style" && <StyleTab id={component.id} />}
        {propsTab === "animations" && <AnimationsTab id={component.id} />}
        {propsTab === "visibility" && <VisibilityTab id={component.id} />}
      </div>
    </aside>
  );
}
