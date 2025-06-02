import { PropsWithChildren } from 'react'

const ChatLayout = ({ children }: PropsWithChildren) => {
	return <div className='mx-auto size-full max-w-4xl'>{children}</div>
}

export default ChatLayout
