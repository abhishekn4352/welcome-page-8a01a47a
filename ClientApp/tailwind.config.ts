import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	safelist: [
		// common dynamic bg colors used by nodes/icons
		'bg-gray-500','bg-blue-500','bg-green-500','bg-purple-500','bg-red-500','bg-yellow-500','bg-pink-500','bg-indigo-500',
		'bg-gray-600','bg-blue-600','bg-green-600','bg-purple-600','bg-red-600','bg-yellow-600','bg-pink-600','bg-indigo-600',
		'bg-slate-900','bg-gray-900','from-gray-900','via-slate-900','to-gray-900'
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Admin app colors - glassmorphism & cyberpunk theme
				primary: "#00d2ff",
				accent: "#ff00ff",
				"background-light": "#f8fafc",
				"background-dark": "#0a0a0c",
				"cyber-gray": "#121214",
				
				// Shadcn compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				display: ['Plus Jakarta Sans', 'sans-serif'],
				sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				orbitron: ['Orbitron', 'sans-serif'],
			},
			borderRadius: {
				DEFAULT: "12px",
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glow': '0 0 20px rgba(0, 210, 255, 0.5)',
				'glow-light': '0 0 20px rgba(59, 130, 246, 0.3)',
				'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
				'glass-light': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'soft-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-slow': 'spin 3s linear infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'bounce-slow': 'bounce 2s infinite',
				'float': 'float 6s ease-in-out infinite',
				'gradient': 'gradient 3s ease infinite',
			},
			backdropBlur: {
				xs: '2px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
