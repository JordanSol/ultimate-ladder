import type {FC} from 'react';
import {useState, useEffect, useRef} from 'react'
import { useSession } from 'next-auth/react';
import { trpc } from "../utils/trpc";
import usePusherStore from "../utils/hooks/pusherStore";

import LoadingSpinner from './Spinner';
import {AiOutlineSend} from 'react-icons/ai'

type MessagesProps = {
    matchId: string,
    isHost: boolean,
    hostName: string,
    guestName: string
}

function getTimeElapsed(datetime: Date): string {
    // Get the current timestamp
    const currentTimestamp = Date.now();
  
    // Calculate the difference between the current timestamp and the timestamp of the given datetime
    const timeElapsed = currentTimestamp - datetime.getTime();
  
    // Calculate the number of seconds, minutes, and hours elapsed
    const secondsElapsed = Math.floor(timeElapsed / 1000);
    const minutesElapsed = Math.floor(secondsElapsed / 60);
    const hoursElapsed = Math.floor(minutesElapsed / 60);
  
    // Return a string representation of the time elapsed
    if (hoursElapsed > 0) {
      return `${hoursElapsed} hour(s) ago`;
    } else if (minutesElapsed > 0) {
      return `${minutesElapsed} minute(s) ago`;
    } else {
      return `${secondsElapsed} second(s) ago`;
    }
  }

const Messages: FC<MessagesProps> = ({ matchId, isHost, hostName, guestName }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: session } = useSession();
    const { data: messages, refetch, isLoading } = trpc.message.getMessages.useQuery({matchId: matchId});
    const createMessage = trpc.message.createMessage.useMutation();
    const pusher = usePusherStore(state => state.pusher);
    const [messageValue, setMessageValue] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the input value in the state
        setMessageValue(event.target.value);
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        const result = await createMessage.mutateAsync({matchId: matchId, host: isHost, content: messageValue})
        if (result) {
            setMessageValue("")
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        // Check if the key that was pressed is the "enter" key
        if (event.key === 'Enter') {
          // Simulate a form submission
          event.currentTarget.dispatchEvent(new Event('submit'));
        }
      };

    useEffect(() => {
        pusher.signin();
        const matches = pusher.subscribe(`match-${matchId}`);
        matches.bind('new-message', refetch);
      }, []);

    return (
        <div className='w-full bg-black/10 col-span-2 lg:col-span-1 rounded-md p-4 grow overflow-y-hidden'>
            { isLoading ? (<LoadingSpinner/>) : (
                <div className='flex flex-col justify-between h-full grow'>
                    <div className=' overflow-y-auto'>
                        <div className='w-full flex flex-col-reverse justify-end h-full'>
                            {messages?.map((message) => (
                                <div key={message.id} className={`chat py-2 ${message.userId === session?.user?.id ? 'chat-end' : 'chat-start'}`}>
                                    <div className='chat-header'>
                                        {message.host ? hostName : guestName}
                                    </div>
                                    <div className={`chat-bubble ${message.userId === session?.user?.id ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}>
                                        {message.content}
                                    </div>
                                    <div className="chat-footer opacity-50">
                                        {getTimeElapsed(message.created)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='grow flex flex-col justify-end'>
                        <form className='flex gap-1' onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                            <input type="text" placeholder="Message" value={messageValue} onChange={handleInputChange} className="input input-bordered focus:border-primary w-full grow" />
                            <button className='btn btn-square btn-ghost text-primary' type="submit" disabled={messageValue === ""}>
                                <AiOutlineSend/>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Messages