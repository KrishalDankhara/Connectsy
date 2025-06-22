// tailwind.config.cjs
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    plugins: [require("daisyui")],
    daisyui: {
      themes: ["light", "dark"], // Simplified themes
      darkTheme: "dark", // Explicitly set dark theme
    },
  };