import type { Metadata } from "next";
import { TemplateLibrary } from "@/features/templates/components/template-library";
import { templates } from "@/features/templates/catalog";

export const metadata: Metadata = {
  title: "Biblioteka szablonów",
  description: "Profesjonalne szablony stron gotowe do edycji w Builderze.",
};

export default function TemplatesPage() {
  return <TemplateLibrary templates={templates} />;
}
