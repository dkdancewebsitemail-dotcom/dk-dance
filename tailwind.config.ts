import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dk: {
          black: "#000000",
          white: "#FFFFFF",
          yellow: "#FFF102",
          red: "#EE1D23",
          dark: "#080808",
          card: "#111111",
          muted: "#737373",
          border: "#1F1F1F",
          "border-light": "#E5E5E5",
        },
      },
      fontFamily: {
        heading: [
          '"SF Pro Display"',
          '"Google Sans"',
          '"SF Pro"',
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        body: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Google Sans"',
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        apple: [
          '"SF Pro Display"',
          '"SF Pro"',
          '"Google Sans"',
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 25s linear infinite",
        "marquee-reverse": "marqueeReverse 25s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
