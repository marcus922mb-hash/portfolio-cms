import { Component, PlusCircle } from "lucide-react";

export default function ComponentBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center panel-enter">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Component className="text-emerald-500" /> Component Builder
          </h1>
          <p className="text-muted-foreground">
            Zarządzaj potężną biblioteką ponad 100 komponentów i ich wariantami.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium shadow-sm hover:bg-primary/90">
          <PlusCircle size={16} /> Dodaj nowy komponent
        </button>
      </div>

      {/* Stats/Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 panel-enter panel-enter-1">
        {["Hero (12)", "Navbar (8)", "Features (15)", "Pricing (6)", "FAQ (9)", "Footer (5)"].map((cat) => (
          <div key={cat} className="p-4 rounded-lg border bg-card text-center hover:border-emerald-500/50 cursor-pointer transition-colors">
            <span className="text-sm font-medium">{cat}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 border rounded-xl overflow-hidden panel-enter panel-enter-2">
        <div className="bg-muted p-4 border-b font-medium flex justify-between items-center">
          Ostatnio dodane komponenty
          <input type="text" placeholder="Szukaj komponentów..." className="px-3 py-1 rounded border text-sm max-w-[200px]" />
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Nazwa</th>
              <th className="px-4 py-3 font-medium">Kategoria</th>
              <th className="px-4 py-3 font-medium">Warianty</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "SaaS Hero Split", cat: "Hero", val: 3 },
              { name: "Mega Menu Dropdown", cat: "Navbar", val: 2 },
              { name: "Bento Grid Features", cat: "Features", val: 5 },
              { name: "FAQ Accordion", cat: "FAQ", val: 1 },
            ].map((item, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted"></div>
                  {item.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.cat}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.val}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs font-semibold">Gotowy</span></td>
                <td className="px-4 py-3 text-right">
                  <button className="text-emerald-500 font-medium hover:underline">Edytuj warianty →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
