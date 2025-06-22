module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    darkMode: "class",
    plugins: [
      require("daisyui"),
    ],
    daisyui: {
      themes: [
        "light", // You can use the built-in 'light' theme, or add your custom theme here
        "dark", // You can also use the dark theme if needed
        {
          mylightblue: {
            primary: "#ADD8E6", // Light blue primary
            secondary: "#87CEFA", // Darker blue
            accent: "#BFEFFF", // Light accent blue
            neutral: "#f3f4f6", // Light neutral color for background
            "base-100": "#ffffff", // Default background color for the base
          },
        },
      ],
    },
  };
  