import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      fontFamily: {
        nekstmedium: ["Nekst-Medium", "sans-serif"],
      },
      colors: {
        modalFrom: "#18171c",
        modalVia: "#23222a",
        modalTo: "#211837",

        modalBgFrom: "#23222a",
        modalBgVia: "#2e2542",
        modalBgTo: "#26223a",

        shadowColor: "#201f3355",
        borderModerate: "#3a306b",

        closeHover: "#a677ee",
        titleText: "#dbb8ff",
        titleIcon: "#a677ee",

        searchBg: "#ffffff",
        searchBorder: "#ffffff",
        searchIcon: "#ffffff",
        placeholder: "#8f8fbb",
        inputText: "#dbb8ff",

        selectedFrom: "#a677ee",
        selectedTo: "#6c47d6",
        selectedBorder: "#a677ee",

        altBg: "#211c2c",
        altText: "#bcb7e5",
        hoverBgFrom: "#2d2545",
        hoverBgTo: "#2e2542",
        hoverText: "#dbb8ff",
        hoverBorder: "#393959",

        sparkle: "#a677ee",

        infoFrom: "#232136",
        infoVia: "#221f35",
        infoTo: "#2b244a",
        infoBorder: "#8C7FF5",
        infoIcon: "#8C7FF5",
        infoLabel: "#BFAAFF",
        descriptionText: "#e4e4ea",
        tipText: "#8C7FF5",
        starText: "#BFAAFF",

        categoriesFrom: "#8C7FF5",
        categoriesTo: "#BFAAFF",
        categoriesText: "#19123b",
        categoriesHoverFrom: "#BFAAFF",
        categoriesHoverTo: "#8C7FF5",
        categoriesFocusRing: "#8C7FF5",
        categoriesHoverBorder: "#8C7FF5",

        bannerFrom: "#f368a6",
        bannerVia: "#8C7FF5",
        bannerTo: "#393c6e",
        bannerGold: "#FFD700",
        bannerText: "#f2defa",
        bannerBtnTextHover: "#232136",

        white: "#ffffff",
      },
      backgroundImage: {
        panelGradient1:
          "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
        panelGradient2:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      },
    },
  },
} satisfies Config;
