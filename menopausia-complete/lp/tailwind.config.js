/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./docs/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#143d2c',
                    800: '#1a4d38',
                    50: '#f2fcf5',
                },
                gold: {
                    400: '#fbbf24',
                    500: '#d97706',
                    600: '#b45309',
                    'metallic': '#d4af37',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
