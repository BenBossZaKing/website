/**
 * Create an SVG pattern <defs> string
 */
function createPatternSvg(id, shapeSvg, width = 20, height = 20) {
  return `
    <pattern id="${id}" width="${width}" height="${height}" patternUnits="userSpaceOnUse">
      ${shapeSvg.join("\n")}
    </pattern>`;
}

/**
 * Generate a `data:image/svg+xml` URL for a background
 */
export function generatePatternDataUrl(patternId, shapeSvg, width = 20, height = 20) {
  const defs = createPatternSvg(patternId, shapeSvg, width, height);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${width}" height="${height}"
         viewBox="0 0 ${width} ${height}">
      <defs>${defs}</defs>
      <rect width="100%" height="100%" fill="url(#${patternId})"/>
    </svg>`;
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml;charset=UTF-8,${encoded}")`;
}
/*--------------------------------------------------*/
/*  Floaty wrapper: drifting highlight behind card  */
/*--------------------------------------------------*/
.floaty {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 220px;
  transform: translate(-50%, -50%);
  /* a soft radial “spotlight” that will move via CSS vars */
  background: radial-gradient(
    circle at var(--hx, 40%) var(--hy, 30%),
    rgba(255,255,255,0.4) 0%,
    rgba(255,255,255,0)   60%
  );
  background-repeat: no-repeat;
  background-size: 200% 200%;
  /* animate those vars to drift the highlight */
  animation: highlight 6s ease-in-out infinite alternate;
}

/* keyframes to tween the CSS vars --hx & --hy */
@keyframes highlight {
  0%   { --hx: 30%; --hy: 40%; }
  25%  { --hx: 70%; --hy: 30%; }
  50%  { --hx: 60%; --hy: 70%; }
  75%  { --hx: 40%; --hy: 50%; }
  100% { --hx: 30%; --hy: 40%; }
}
