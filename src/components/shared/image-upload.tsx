'use client'

import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'

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
		<div className="flex flex-col items-center justify-center w-full space-y-4">
			<CldUploadButton
				uploadPreset="next-companion"
				options={{ maxFiles: 1 }}
				onSuccess={(result: any) => {
					onChange(result.info.secure_url)
				}}
				onError={(error) => console.error('Upload error:', error)}
			>
				<div className="flex flex-col items-center justify-center p-4 space-y-2 border-4 border-dashed border-primary/10 rounded-lg cursor-pointer hover:opacity-75 transition">
					<div className="relative size-40">
						<Image
							src={value || '/svg/placeholder.svg'}
							alt="Upload"
							fill
							className="rounded-lg object-cover"
						/>
					</div>
				</div>
			</CldUploadButton>
		</div>
	)
}
