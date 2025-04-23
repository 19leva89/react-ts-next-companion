import { MenuIcon } from 'lucide-react'

import { Sidebar } from '@/components/shared'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui'

interface Props {
	isPro: boolean
}

export const MobileSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger className="cursor-pointer md:hidden">
				<MenuIcon />
			</SheetTrigger>

			<SheetContent side="left" className="w-32 p-0 pt-10 bg-secondary" aria-describedby={undefined}>
				<SheetTitle className="hidden" />

				<SheetDescription className="hidden" />

				<Sidebar
				// isPro={isPro}
				/>
			</SheetContent>
		</Sheet>
	)
}
