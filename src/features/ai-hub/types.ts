export type ToolFieldType = "text" | "textarea" | "select";

export type ToolField = {
  key: string;
  label: string;
  type: ToolFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  maxLength?: number;
  rows?: number;
};

export type ToolCategory =
  | "content"
  | "identity"
  | "legal"
  | "seo"
  | "social"
  | "analysis"
  | "design"
  | "business";

export type AIToolDef = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  category: ToolCategory;
  badge?: "Nowe" | "Beta" | "Wkrótce";
  fields: ToolField[];
  systemPrompt: string;
  buildPrompt: (values: Record<string, string>) => string;
  outputFormat: "text" | "list" | "sections" | "colors" | "svg" | "svg-icons" | "html";
  exampleSnippet: string;
  ctaLabel: string;
  available: boolean;
};

export type ToolResult = {
  text: string;
  provider: string;
  model: string;
};
