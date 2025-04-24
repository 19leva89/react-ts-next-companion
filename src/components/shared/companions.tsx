import Link from 'next/link'
import Image from 'next/image'
import { MessagesSquareIcon } from 'lucide-react'

import { Companion } from '@/generated/prisma'
import { Card, CardFooter, CardHeader } from '@/components/ui'

interface Props {
	data: (Companion & {
		_count: {
			messages: number
		}
	})[]
}

export const Companions = ({ data }: Props) => {
	if (data.length === 0)
		return (
			<div className="flex flex-col items-center justify-center pt-10 space-y-3">
				<div className="relative size-60">
					<Image src="/img/empty.png" alt="Empty" fill className="grayscale" />
				</div>

				<p className="text-sm text-muted-foreground">No Companions Found</p>
			</div>
		)

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
			{data.map((item) => (
				<Card
					key={item.id}
					className="border-0 rounded-xl bg-primary/10  cursor-pointer hover:opacity-75 transition"
				>
					<Link href={`/chat/${item.id}`}>
						<CardHeader className="flex items-center justify-center text-center text-muted-foreground">
							<div className="relative size-32">
								<Image src={item.src} alt={item.name} fill className="rounded-xl object-cover" />
							</div>

							<p className="font-bold">{item.name}</p>

							<p className="text-xs">{item.description}</p>
						</CardHeader>

						<CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
							<p className="lowercase">{item.email}</p>

							<div className="flex items-center">
								<MessagesSquareIcon className="size-3 mr-1" />

								{item._count.messages}
							</div>
						</CardFooter>
					</Link>
				</Card>
			))}
		</div>
	)
}
