import { useUser } from '@clerk/nextjs'

import { Avatar, AvatarImage } from '@/components/ui'

export const UserAvatar = () => {
	const { user } = useUser()

	return (
		<Avatar className="size-12">
			<AvatarImage src={user?.imageUrl} className="size-12" />
		</Avatar>
	)
}
