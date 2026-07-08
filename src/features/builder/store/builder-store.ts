"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  BuilderComponent,
  BuilderPageSettings,
  ComponentDefinition,
  ComponentStyles,
  ComponentAnimation,
  ComponentVisibility,
  Device,
  SidebarTab,
  PropsTab,
  AnimationType,
} from "@/features/builder/types";

const MAX_HISTORY = 50;

function defaultAnimation(): ComponentAnimation {
  return { type: "none" as AnimationType, duration: 400, delay: 0, easing: "ease-out" };
}

function defaultVisibility(): ComponentVisibility {
  return { desktop: true, tablet: true, mobile: true };
}

function makeComponent(def: ComponentDefinition): BuilderComponent {
  return {
    id: nanoid(),
    type: def.type,
    label: def.label,
    props: { ...def.defaultProps },
    styles: { ...def.defaultStyles },
    animations: defaultAnimation(),
    visibility: defaultVisibility(),
    children: [],
  };
}

type BuilderState = {
  pageId: string | null;
  pageName: string;
  demoId: string | null;
  components: BuilderComponent[];
  settings: BuilderPageSettings;
  selectedId: string | null;
  device: Device;
  history: BuilderComponent[][];
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  sidebarTab: SidebarTab;
  propsTab: PropsTab;
};

type BuilderActions = {
  init: (args: {
    pageId: string | null;
    pageName: string;
    demoId: string | null;
    components: BuilderComponent[];
    settings: BuilderPageSettings;
    device?: Device;
  }) => void;
  selectComponent: (id: string | null) => void;
  addComponent: (def: ComponentDefinition, afterId?: string | null) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  updateProps: (id: string, props: Partial<Record<string, unknown>>) => void;
  updateStyles: (id: string, styles: Partial<ComponentStyles>) => void;
  updateAnimations: (id: string, animations: Partial<ComponentAnimation>) => void;
  updateVisibility: (id: string, visibility: Partial<ComponentVisibility>) => void;
  setDevice: (device: Device) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setPropsTab: (tab: PropsTab) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
  setSaving: (v: boolean) => void;
  getSelectedComponent: () => BuilderComponent | null;
  loadTemplate: (components: BuilderComponent[]) => void;
};

function snapshot(state: BuilderState, components: BuilderComponent[]): Partial<BuilderState> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(components)));
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1, isDirty: true };
}

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  // state
  pageId: null,
  pageName: "Nowa strona",
  demoId: null,
  components: [],
  settings: {},
  selectedId: null,
  device: "desktop",
  history: [[]],
  historyIndex: 0,
  isDirty: false,
  isSaving: false,
  sidebarTab: "components",
  propsTab: "content",

  // actions
  init({ pageId, pageName, demoId, components, settings, device }) {
    const initial = JSON.parse(JSON.stringify(components)) as BuilderComponent[];
    set({
      pageId,
      pageName,
      demoId,
      components: initial,
      settings,
      device: device ?? "desktop",
      selectedId: null,
      history: [initial],
      historyIndex: 0,
      isDirty: false,
      isSaving: false,
    });
  },

  selectComponent(id) {
    set({ selectedId: id, propsTab: "content" });
  },

  addComponent(def, afterId) {
    const state = get();
    const newComp = makeComponent(def);
    const comps = [...state.components];
    if (afterId) {
      const idx = comps.findIndex((c) => c.id === afterId);
      comps.splice(idx + 1, 0, newComp);
    } else {
      comps.push(newComp);
    }
    set({ components: comps, selectedId: newComp.id, ...snapshot(state, comps) });
  },

  removeComponent(id) {
    const state = get();
    const comps = state.components.filter((c) => c.id !== id);
    set({
      components: comps,
      selectedId: state.selectedId === id ? null : state.selectedId,
      ...snapshot(state, comps),
    });
  },

  duplicateComponent(id) {
    const state = get();
    const idx = state.components.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const clone: BuilderComponent = JSON.parse(JSON.stringify(state.components[idx]));
    clone.id = nanoid();
    const comps = [...state.components];
    comps.splice(idx + 1, 0, clone);
    set({ components: comps, selectedId: clone.id, ...snapshot(state, comps) });
  },

  moveComponent(fromIndex, toIndex) {
    const state = get();
    if (fromIndex === toIndex) return;
    const comps = [...state.components];
    const [item] = comps.splice(fromIndex, 1);
    comps.splice(toIndex, 0, item);
    set({ components: comps, ...snapshot(state, comps) });
  },

  updateProps(id, props) {
    const state = get();
    const comps = state.components.map((c) =>
      c.id === id ? { ...c, props: { ...c.props, ...props } } : c
    );
    set({ components: comps, ...snapshot(state, comps) });
  },

  updateStyles(id, styles) {
    const state = get();
    const comps = state.components.map((c) =>
      c.id === id ? { ...c, styles: { ...c.styles, ...styles } } : c
    );
    set({ components: comps, ...snapshot(state, comps) });
  },

  updateAnimations(id, animations) {
    const state = get();
    const comps = state.components.map((c) =>
      c.id === id ? { ...c, animations: { ...c.animations, ...animations } } : c
    );
    set({ components: comps, ...snapshot(state, comps) });
  },

  updateVisibility(id, visibility) {
    const state = get();
    const comps = state.components.map((c) =>
      c.id === id ? { ...c, visibility: { ...c.visibility, ...visibility } } : c
    );
    set({ components: comps, ...snapshot(state, comps) });
  },

  setDevice(device) { set({ device }); },
  setSidebarTab(tab) { set({ sidebarTab: tab }); },
  setPropsTab(tab) { set({ propsTab: tab }); },

  undo() {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const comps = JSON.parse(JSON.stringify(history[newIndex])) as BuilderComponent[];
    set({ components: comps, historyIndex: newIndex, isDirty: newIndex > 0 });
  },

  redo() {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const comps = JSON.parse(JSON.stringify(history[newIndex])) as BuilderComponent[];
    set({ components: comps, historyIndex: newIndex, isDirty: true });
  },

  markSaved() { set({ isDirty: false }); },
  setSaving(v) { set({ isSaving: v }); },

  loadTemplate(components) {
    const state = get();
    set({ components, selectedId: null, ...snapshot(state, components) });
  },

  getSelectedComponent() {
    const { components, selectedId } = get();
    return components.find((c) => c.id === selectedId) ?? null;
  },
}));
