import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        headline: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-montserrat)", "sans-serif"],
        label: ["var(--font-montserrat)", "sans-serif"],
      },

      fontSize: {
        // Custom headline sizes from DESIGN.md
        "display-lg": [
          "3.5rem",
          {
            lineHeight: "1.1",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          },
        ],

        "headline-lg": [
          "2rem",
          {
            lineHeight: "1.2",
            fontWeight: "700",
          },
        ],

        "headline-md": [
          "1.75rem",
          {
            lineHeight: "1.3",
            fontWeight: "500",
          },
        ],

        "title-lg": [
          "1.375rem",
          {
            lineHeight: "1.4",
            fontWeight: "700",
          },
        ],

        "body-lg": [
          "1rem",
          {
            lineHeight: "1.6",
            fontWeight: "400",
          },
        ],

        "label-md": [
          "0.75rem",
          {
            lineHeight: "1.5",
            fontWeight: "500",
          },
        ],
      },

      borderRadius: {
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
        DEFAULT: "0.25rem",
      },

      boxShadow: {
        soft: "0px 12px 32px rgba(20, 29, 32, 0.06)",
      },

      backgroundImage: {
        "biophilic-gradient":
          "linear-gradient(135deg, #006c4a 0%, #00a775 100%)",

        "mesh-gradient":
          "radial-gradient(circle at 20% 50%, rgba(42, 157, 143, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(31, 150, 200, 0.1) 0%, transparent 50%)",
      },

      animation: {
        marquee: "marquee 30s linear infinite",

        "pulse-glow":
          "pulse-glow 2s cubic-bezier(0.4,0,0.6,1) infinite",

        progress:
          "progress 3s ease-in-out infinite",

        "fade-in-up":
          "fadeInUp 0.8s ease-out forwards",

        "loader-enter":
          "loaderEnter 0.6s ease-out forwards",

        "loader-exit":
          "loaderExit 0.5s ease-in forwards",
      },

      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow:
              "0 0 0 0 rgba(0,167,117,0.4)",
          },

          "50%": {
            opacity: "0.7",
            transform: "scale(1.05)",
            boxShadow:
              "0 0 20px 10px rgba(0,167,117,0)",
          },
        },

        progress: {
          "0%": {
            transform: "scaleX(0)",
          },

          "50%": {
            transform: "scaleX(1)",
          },

          "100%": {
            transform: "scaleX(0)",
            transformOrigin: "right",
          },
        },

        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },

  plugins: [],
} satisfies Config;

export default config;