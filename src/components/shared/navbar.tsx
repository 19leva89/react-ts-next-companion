'use client'

import Link from 'next/link'
import { Poppins } from 'next/font/google'
import { UserButton } from '@clerk/nextjs'
import { SparklesIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/shared'
import { useProModal } from '@/hooks/use-pro-modal'
// import {MobileSidebar} from '@/components/mobile-sidebar'

const font = Poppins({
	weight: '600',
	subsets: ['latin'],
})

interface Props {
	isPro: boolean
}

export const Navbar = () => {
	const proModal = useProModal()

	return (
		<div className="z-50 fixed flex justify-between items-center w-full h-16 py-2 px-4 border-b border-primary/10 bg-secondary">
			<div className="flex items-center">
				{/* <MobileSidebar isPro={isPro} /> */}

				<Link href="/">
					<h1 className={cn('hidden md:block text-xl md:text-3xl font-bold text-primary', font.className)}>
						companion.ai
					</h1>
				</Link>
			</div>

			<div className="flex items-center gap-x-3">
				{/* {!isPro && ( */}
				<Button variant="premium" size="sm" onClick={proModal.onOpen} className="cursor-pointer">
					Upgrade
					<SparklesIcon className="size-4 ml-2 fill-white text-white" />
				</Button>
				{/* )} */}

				<ModeToggle />

				<UserButton />
			</div>
		</div>
	)
}
