/**
 * Color Resolution Helper
 * Converts any CSS variable or theme token into computed rgb(r, g, b) on page load.
 * Prevents forced style re-computations and frame drops during scroll transitions.
 */
export const resolveColor = (cssVariable: string, fallback = "rgb(0, 0, 0)"): string => {
  if (typeof document === "undefined") {
    return fallback;
  }

  try {
    const temp = document.createElement("div");
    const formattedVar = cssVariable.startsWith("--")
      ? `var(${cssVariable})`
      : cssVariable.startsWith("var(")
      ? cssVariable
      : `var(--${cssVariable})`;

    temp.style.color = formattedVar;
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.pointerEvents = "none";
    document.body.appendChild(temp);
    const computedColor = getComputedStyle(temp).color;
    temp.remove();
    return computedColor || fallback;
  } catch {
    return fallback;
  }
};
