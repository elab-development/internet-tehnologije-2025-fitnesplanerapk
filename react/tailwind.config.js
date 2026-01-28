// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}", // very important
//   ],
//   theme: {
//     extend: {
//         colors: {
//         primary: "#eda336",  //dugmici
//         primaryHover: "#5563c1",
//         secondary: "#a0aec0",
//         secondaryHover: "#718096",
//         background: "#EFF3F1",  //glavna pozadina
//         surface: "#feddfe",  //neko dodatno polje na stranici
//         textPrimary: "#000000",  //glavni tekst
//         textSecondary: "#515bff",  //linkovi
//         success: "#89e1b2",
//         error: "#ef7777",
//         warning: "#e8af89",
//       },
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#eda336",  // dugmici
        primaryHover: "#5563c1",
        secondary: "#a0aec0",
        secondaryHover: "#718096",
        background: "#EFF3F1",  // glavna pozadina
        surface: "#feddfe",  // neko dodatno polje na stranici
        textPrimary: "#000000",  // glavni tekst
        textSecondary: "#515bff",  // linkovi
        success: "#89e1b2",
        error: "#ef7777",
        warning: "#e8af89",
      },
    },
  },
  plugins: [],
};
