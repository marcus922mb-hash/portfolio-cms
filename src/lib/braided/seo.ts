import type { Metadata } from "next";

export function canonical(path: `/${string}` = "/"): Metadata["alternates"] {
  return {
    canonical: path,
  };
}
