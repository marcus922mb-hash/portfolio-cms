const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'app/panel/studio');

const modules = [
    { name: 'visual-builder', title: 'Visual Builder', icon: 'MonitorPlay', color: '#3b82f6' },
    { name: 'components', title: 'Component Builder', icon: 'Component', color: '#10b981' },
    { name: 'animations', title: 'Animation Studio', icon: 'Film', color: '#f59e0b' },
    { name: 'themes', title: 'Theme Builder', icon: 'Palette', color: '#d946ef' },
    { name: 'templates', title: 'Template Builder', icon: 'LayoutTemplate', color: '#8b5cf6' },
    { name: 'media', title: 'Media Studio', icon: 'Image', color: '#06b6d4' },
    { name: 'seo', title: 'SEO Studio', icon: 'Search', color: '#eab308' },
    { name: 'code', title: 'Code Studio', icon: 'Code2', color: '#64748b' }
];

modules.forEach(m => {
    const dir = path.join(basePath, m.name);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const pagePath = path.join(dir, 'page.tsx');
    const pageContent = `import { ${m.icon} } from "lucide-react";

export default function ${m.title.replace(/ /g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="panel-enter">
        <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <${m.icon} style={{ color: '${m.color}' }} /> ${m.title}
        </h1>
        <p className="text-muted-foreground">
          Moduł ${m.name} w trakcie przygotowywania. To jest wersja zapoznawcza (v1).
        </p>
      </div>
      <div className="border rounded-xl p-8 bg-card text-center panel-enter panel-enter-1">
        Dalsza rozbudowa (Nesting, Grid/Flex we własnym zakresie, Monaco Editor, edytor animacji GUI)
        wymaga pełnej implementacji silnika. Struktura została utworzona.
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, pageContent);
    console.log(`Created ${pagePath}`);
});

console.log('Skeleton pages created successfully.');
