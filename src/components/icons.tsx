import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function Arrow({ className = "size-4", ...props }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function MenuIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>; }
export function CloseIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>; }
export function WhatsAppIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"/><path d="M9 8.5c.2-.5.5-.5.8-.5.2 0 .4 0 .6.5l.7 1.5c.1.3 0 .5-.2.7l-.5.6c.7 1.4 1.8 2.4 3.2 3l.5-.7c.2-.3.4-.3.7-.2l1.5.7c.3.2.4.3.4.6 0 .7-.5 1.5-1.1 1.8-.6.3-1.4.4-2.8-.2-2.3-.9-4.7-3.1-5.5-5.5-.4-1.2-.1-1.9.2-2.3.3-.4.8-.5 1.5 0Z"/></svg>; }
export function CheckIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="m5 12 4 4L19 7" /></svg>; }
export function PlusIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M12 5v14M5 12h14" /></svg>; }
export function GlobeIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z"/></svg>; }
export function BagIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>; }
export function LinkIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="m9.5 14.5 5-5M7.5 17H6a4 4 0 0 1 0-8h3M16.5 7H18a4 4 0 0 1 0 8h-3"/></svg>; }
export function ToolsIcon(props: IconProps) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="m14 6 4-4 4 4-4 4M13 7 3 17v4h4L17 11M3 3l18 18"/></svg>; }
