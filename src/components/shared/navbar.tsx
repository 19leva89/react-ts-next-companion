'use client'

import Link from 'next/link'
import { Poppins } from 'next/font/google'
import { UserButton } from '@clerk/nextjs'
import { SparklesIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useProModal } from '@/hooks/use-pro-modal'
import { MobileSidebar, ModeToggle } from '@/components/shared'

const font = Poppins({
	weight: '600',
	subsets: ['latin'],
})

interface Props {
	isPro: boolean
}

export const Navbar = ({ isPro }: Props) => {
	const proModal = useProModal()

	return (
		<div className='fixed z-50 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-secondary px-4 py-2'>
			<div className='flex items-center gap-4'>
				<MobileSidebar isPro={isPro} />

				<Link href='/'>
					<h1 className={cn('hidden text-xl font-bold text-primary md:block md:text-3xl', font.className)}>
						companion.ai
					</h1>
				</Link>
			</div>

			<div className='flex items-center gap-x-3'>
				{!isPro && (
					<Button variant='premium' size='sm' onClick={proModal.onOpen} className='cursor-pointer'>
						Upgrade
						<SparklesIcon className='ml-2 size-4 fill-white text-white' />
					</Button>
				)}

				<ModeToggle />

				<UserButton />
			</div>
		</div>
	)
}
