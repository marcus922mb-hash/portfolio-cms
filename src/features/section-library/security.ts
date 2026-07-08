import type { SectionSecurityFinding, SectionSecurityReport } from "@/features/section-library/types";

const SCRIPT_RE = /<script[\s>]/i;
const IFRAME_RE = /<iframe[\s>]/i;
const EXTERNAL_SCRIPT_RE = /<script[^>]+src\s*=\s*["'][^"']+/i;
const TOKEN_RE = /(sk-[A-Za-z0-9]{16,}|api[_-]?key|secret[_-]?key|bearer\s+[A-Za-z0-9\-_\.=]+)/i;
const SUSPICIOUS_LINK_RE = /href\s*=\s*["'](?:javascript:|data:|vbscript:)/i;
const ON_EVENT_RE = /\son[a-z]+\s*=\s*["'][^"']+["']/i;

const NEW_FUNCTION_RE = /\bnew Function\s*\(|\beval\s*\(/i;
const PRIVATE_KEY_RE = /-----BEGIN (?:RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----/i;

const DEPENDENCY_HINTS = [
  { regex: /framer-motion/i, message: "Wykryto Framer Motion." },
  { regex: /lucide-react/i, message: "Wykryto Lucide Icons." },
  { regex: /heroicons/i, message: "Wykryto Heroicons." },
  { regex: /@headlessui|radix-ui/i, message: "Wykryto komponenty Headless UI / Radix." },
];

function pushFinding(findings: SectionSecurityFinding[], type: SectionSecurityFinding["type"], severity: SectionSecurityFinding["severity"], message: string, details?: string) {
  findings.push({ type, severity, message, details });
}

export function scanSectionCode(code: string, dependencies: string[] = []): SectionSecurityReport {
  const findings: SectionSecurityFinding[] = [];
  const normalized = code ?? "";

  if (SCRIPT_RE.test(normalized)) {
    pushFinding(findings, "script", "high", "Wykryto tag <script>.", "Nie uruchamiaj kodu bez sandboxa.");
  }

  if (IFRAME_RE.test(normalized)) {
    pushFinding(findings, "iframe", "medium", "Wykryto iframe.", "Zweryfikuj atrybuty sandbox i pochodzenie treści.");
  }

  if (EXTERNAL_SCRIPT_RE.test(normalized)) {
    pushFinding(findings, "external_script", "high", "Wykryto zewnętrzny skrypt.", "Sprawdź czy import jest konieczny i bezpieczny.");
  }

  if (TOKEN_RE.test(normalized)) {
    pushFinding(findings, "api_token", "high", "Wykryto możliwy token lub sekret API.");
  }

  if (PRIVATE_KEY_RE.test(normalized)) {
    pushFinding(findings, "secret", "high", "Wykryto prywatny klucz.");
  }

  if (SUSPICIOUS_LINK_RE.test(normalized)) {
    pushFinding(findings, "suspicious_link", "medium", "Wykryto potencjalnie niebezpieczny link.");
  }

  if (ON_EVENT_RE.test(normalized) || NEW_FUNCTION_RE.test(normalized)) {
    pushFinding(findings, "unsafe_js", "medium", "Wykryto podejrzany JavaScript.");
  }

  for (const hint of DEPENDENCY_HINTS) {
    if (hint.regex.test(normalized)) {
      pushFinding(findings, "dependency", "low", hint.message);
    }
  }

  const dependencySet = new Set<string>(dependencies);
  if ([...dependencySet].some((dep) => /lodash|moment|jquery|eval/i.test(dep))) {
    pushFinding(findings, "dependency", "medium", "Wykryto ciężką lub potencjalnie ryzykowną zależność.");
  }

  const riskScore = Math.min(
    100,
    findings.reduce((score, item) => score + (item.severity === "high" ? 30 : item.severity === "medium" ? 15 : 5), 0)
  );

  return {
    safe: findings.every((finding) => finding.severity !== "high"),
    findings,
    riskScore,
    summary:
      findings.length === 0
        ? "Nie wykryto oczywistych zagrożeń."
        : `Wykryto ${findings.length} potencjalnych problemów bezpieczeństwa.`,
  };
}

