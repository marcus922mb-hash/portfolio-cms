import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Website Studio | MA Atelier",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="panel-studio-layout">
            {children}
        </div>
    );
}
