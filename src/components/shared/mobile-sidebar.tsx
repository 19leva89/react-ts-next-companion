import { MenuIcon } from 'lucide-react'

import { Sidebar } from '@/components/shared'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui'

interface Props {
	isPro: boolean
}

export const MobileSidebar = ({ isPro }: Props) => {
	return (
		<Sheet>
			<SheetTrigger className='cursor-pointer md:hidden'>
				<MenuIcon />
			</SheetTrigger>

			<SheetContent side='left' className='w-32 bg-secondary p-0 pt-10' aria-describedby={undefined}>
				<SheetTitle className='hidden' />

				<SheetDescription className='hidden' />

				<Sidebar isPro={isPro} />
			</SheetContent>
		</Sheet>
	)
}
