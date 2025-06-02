'use client'

import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'

import { cn } from '@/lib/utils'
import { useClient } from '@/hooks/use-client'

interface Props {
	value: string
	disabled?: boolean
	onChange: (src: string) => void
}

export const ImageUpload = ({ value, disabled, onChange }: Props) => {
	const { isMounted } = useClient()

	if (!isMounted) return null

	return (
		<div className='flex w-full flex-col items-center justify-center space-y-4'>
			<div className={cn('w-fit', disabled && 'pointer-events-none opacity-50')}>
				<CldUploadButton
					uploadPreset='next-companion'
					options={{ maxFiles: 1 }}
					onSuccess={(result: any) => {
						onChange(result.info.secure_url)
					}}
					onError={(error) => console.error('Upload error:', error)}
				>
					<div className='flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-4 border-dashed border-primary/10 p-4 transition hover:opacity-75'>
						<div className='relative size-40'>
							<Image
								src={value || '/svg/placeholder.svg'}
								alt='Upload'
								fill
								className='rounded-lg object-cover'
							/>
						</div>
					</div>
				</CldUploadButton>
			</div>
		</div>
	)
}
