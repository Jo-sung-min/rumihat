import type { CSSProperties } from "react";

type ProductVisualProps = {
  tone: string;
  accent?: string;
  logo?: "com" | "sebs";
  flower?: boolean;
};

export function ProductVisual({ tone, accent = "#fbf4df", logo = "com", flower = false }: ProductVisualProps) {
  const capStyle = {
    "--cap-tone": tone,
    "--cap-accent": accent
  } as CSSProperties & Record<string, string>;

  return (
    <div className="cap-visual" style={capStyle}>
      <div className="cap-crown">
        <span className="cap-button" />
        <span className="cap-eyelet left" />
        <span className="cap-eyelet right" />
        <span className="cap-logo">{logo === "com" ? ".COM" : "Sebs."}</span>
        {flower ? <span className="cap-flower" /> : null}
      </div>
      <div className="cap-brim" />
    </div>
  );
}
