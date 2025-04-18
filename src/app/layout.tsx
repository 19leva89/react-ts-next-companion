import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'

import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'AI Companion',
	description: 'AI Companion made using Next.js, React.js, TypeScript, TailwindCSS, Prisma & Stripe.',
}

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={cn('bg-secondary', inter.className)}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{/* <ProModal /> */}

						{children}

						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}

export default RootLayout
