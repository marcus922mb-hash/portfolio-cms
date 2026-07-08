export type ComponentType =
  | "hero" | "navbar" | "about" | "services" | "features"
  | "gallery" | "testimonials" | "faq" | "pricing" | "cta"
  | "statistics" | "team" | "timeline" | "steps" | "contact"
  | "footer" | "video" | "map" | "newsletter" | "instagram"
  | "tiktok" | "woo-products" | "blog"
  | "linkinbio"
  // Nowe sekcje
  | "separator" | "text" | "logos" | "portfolio"
  | "banner" | "columns" | "quote" | "image"
  // Warianty nawigacji
  | "navbar-minimal" | "navbar-centered"
  // Warianty stopki
  | "footer-minimal" | "footer-extended"
  // Dodatkowe sekcje
  | "hero-split" | "process" | "awards" | "comparison" | "countdown" | "careers"
  | "menu-section" | "reservation" | "accordion" | "tabs" | "slider" | "hero-video" | "hero-fullscreen" | "reviews-grid" | "media-row" | "icon-grid" | "pricing-toggle" | "sticky-cta" | "before-after" | "links-list" | "event";

export type ComponentCategory =
  | "layout" | "content" | "media" | "commerce" | "social";

export type Device = "desktop" | "tablet" | "mobile";
export type TextAlign = "left" | "center" | "right";
export type AnimationType =
  | "none"
  | "fadeIn"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "reveal"
  | "parallax"
  | "bounce"
  | "flip"
  | "stagger"
  | "float"
  | "pulse"
  | "blur"
  | "elastic"
  | "typewriter";

export type ResponsiveStyles = {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  textAlign?: TextAlign;
};

export type ComponentStyles = {
  background?: string;
  backgroundImage?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  borderRadius?: string;
  shadow?: string;
  textAlign?: TextAlign;
  color?: string;
  maxWidth?: string;
  minHeight?: string;
  tablet?: ResponsiveStyles;
  mobile?: ResponsiveStyles;
};

export type ComponentAnimation = {
  type: AnimationType;
  duration: number;
  delay: number;
  easing: string;
};

export type ComponentVisibility = {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
};

export type BuilderComponent = {
  id: string;
  type: ComponentType;
  label: string;
  props: Record<string, unknown>;
  styles: ComponentStyles;
  animations: ComponentAnimation;
  visibility: ComponentVisibility;
  children: BuilderComponent[];
};

export type BuilderPageSettings = {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    dark: string;
    light: string;
  };
  fonts?: { heading: string; body: string };
  animationLibrary?: string[];
  seo?: { title: string; description: string };
  notFound?: { title: string; description: string; cta: string };
  sourceTemplateId?: string;
};

export type BuilderPage = {
  id: string;
  demo_id: string | null;
  name: string;
  components: BuilderComponent[];
  settings: BuilderPageSettings;
  created_at: string;
  updated_at: string;
};

export type ComponentDefinition = {
  type: ComponentType;
  label: string;
  category: ComponentCategory;
  description: string;
  defaultProps: Record<string, unknown>;
  defaultStyles: ComponentStyles;
};

export type PropFieldType = "text" | "textarea" | "color" | "number" | "select" | "image" | "boolean" | "list";

export type PropField = {
  key: string;
  label: string;
  type: PropFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  itemFields?: Omit<PropField, "itemFields">[];
};

export type PropSchema = {
  type: ComponentType;
  fields: PropField[];
};

export type BuilderHistoryEntry = BuilderComponent[];

export type SidebarTab = "components" | "layers" | "templates" | "generator";
export type PropsTab = "content" | "style" | "animations" | "visibility";
