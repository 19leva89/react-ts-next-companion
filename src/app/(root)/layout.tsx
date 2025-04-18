import { PropsWithChildren } from 'react'

// import {Sidebar} from '@/components/sidebar'
// import { checkSubscription } from '@/lib/subscription'

import { Navbar } from '@/components/shared'

const RootLayout = ({ children }: PropsWithChildren) => {
	// const isPro = await checkSubscription()

	return (
		<div className="h-full">
			<Navbar
			// isPro={isPro}
			/>

			<div className="hidden fixed flex-col md:flex w-20 mt-16 inset-y-0">
				{/* <Sidebar isPro={isPro} /> */}
			</div>

			<main className="h-full pt-16 md:pl-20">{children}</main>
		</div>
	)
}

export default RootLayout
