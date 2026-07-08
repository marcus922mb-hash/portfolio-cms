"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, Folders, FileText, Search, Grid, List as ListIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MediaStudioPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);

  // Mocked media data based on what's available
  const [media] = useState([
    { id: 1, name: "hero-bg.webp", size: "1.2 MB", dimensions: "1920x1080", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80", type: "image/webp" },
    { id: 2, name: "team-photo.avif", size: "450 KB", dimensions: "800x800", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80", type: "image/avif" },
    { id: 3, name: "product-1.png", size: "890 KB", dimensions: "1080x1080", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80", type: "image/png" },
    { id: 4, name: "logo-vector.svg", size: "24 KB", dimensions: "Vector", url: "", type: "image/svg+xml" },
    { id: 5, name: "office.jpg", size: "2.1 MB", dimensions: "2400x1600", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80", type: "image/jpeg" },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Pliki zostały pomyślnie przesłane i skompresowane (AVIF).");
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <ImageIcon className="text-cyan-500" /> Media Studio
          </h1>
          <p className="text-muted-foreground text-sm">
            Centralna biblioteka plików. Obrazy są automatycznie optymalizowane (WebP/AVIF).
          </p>
        </div>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          disabled={isUploading}
        >
          <Upload size={16} />
          {isUploading ? "Przesyłanie..." : "Wgraj pliki"}
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar Folders */}
        <div className="w-56 flex flex-col border rounded-xl bg-card">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium">
              <Folders size={16} /> Wszystkie pliki
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground">
              <ImageIcon size={16} className="text-muted-foreground" /> Zdjęcia
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground">
              <FileText size={16} className="text-muted-foreground" /> Dokumenty
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground">
              <ImageIcon size={16} className="text-muted-foreground" /> Wektory (SVG)
            </button>
          </div>
          <div className="p-4 border-t bg-muted/30">
            <div className="text-xs font-medium mb-2 flex justify-between">
              <span>Pojemność</span>
              <span>1.2 GB / 5 GB</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-1/4 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 border rounded-xl bg-card flex flex-col">
          <div className="p-3 border-b flex justify-between items-center bg-muted/20">
            <span className="text-sm font-medium">Ostatnio dodane ({media.length})</span>
            <div className="flex border rounded-md overflow-hidden bg-background">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 ${view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {view === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {media.map((file) => (
                  <div key={file.id} className="group relative border rounded-lg overflow-hidden bg-background">
                    <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                      {file.url ? (
                        <img src={file.url} alt={file.name} className="object-cover w-full h-full transition-transform group-hover:scale-105" loading="lazy" />
                      ) : (
                        <FileText size={48} className="text-muted-foreground/30" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <button className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-2 border-t">
                      <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-muted-foreground flex justify-between mt-1">
                        <span>{file.size}</span>
                        <span>{file.type.split('/')[1].toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-2 font-medium">Plik</th>
                      <th className="px-4 py-2 font-medium">Rozmiar</th>
                      <th className="px-4 py-2 font-medium">Wymiary</th>
                      <th className="px-4 py-2 font-medium text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {media.map((file) => (
                      <tr key={file.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                            {file.url ? <img src={file.url} className="w-full h-full object-cover" /> : <FileText size={16} />}
                          </div>
                          <span className="font-medium">{file.name}</span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{file.size}</td>
                        <td className="px-4 py-2 text-muted-foreground">{file.dimensions}</td>
                        <td className="px-4 py-2 text-right">
                          <button className="text-red-500 hover:bg-red-500/10 p-1.5 rounded"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
