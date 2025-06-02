'use client'

import { usePathname, useRouter } from 'next/navigation'
import { HomeIcon, PlusIcon, SettingsIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useProModal } from '@/hooks/use-pro-modal'

interface Props {
	isPro: boolean
}

export const Sidebar = ({ isPro }: Props) => {
	const router = useRouter()
	const pathname = usePathname()
	const proModal = useProModal()

	const routes = [
		{
			icon: HomeIcon,
			href: '/',
			label: 'Home',
			pro: false,
		},
		{
			icon: PlusIcon,
			href: '/companion/new',
			label: 'Create',
			pro: true,
		},
		{
			icon: SettingsIcon,
			href: '/settings',
			label: 'Settings',
			pro: false,
		},
	]

	const onNavigate = (url: string, pro: boolean) => {
		if (pro && !isPro) return proModal.onOpen()

		return router.push(url)
	}

	return (
		<div className='flex h-full flex-col space-y-4 bg-secondary text-primary'>
			<div className='flex flex-1 justify-center p-3'>
				<div className='space-y-2'>
					{routes.map((route) => (
						<div
							key={route.href}
							onClick={() => onNavigate(route.href, route.pro)}
							className={cn(
								'group flex w-full cursor-pointer justify-start rounded-lg p-3 text-xs font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary',
								pathname === route.href && 'bg-primary/10 text-primary',
							)}
						>
							<div className='flex flex-1 flex-col items-center gap-y-2'>
								<route.icon className='size-5' />

								{route.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
