import create from 'zustand'
import Pusher from 'pusher-js'
import { env } from '../../env/client.mjs'

type PusherStore = {
    pusher: Pusher;
}


const usePusherStore = create<PusherStore>(() => ({
    pusher: new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: 'us3',
        userAuthentication: {
            endpoint: "/api/pusher/auth-user",
            transport: "ajax",
        },
        channelAuthorization: {
            endpoint: "/api/pusher/auth-channel",
            transport: "ajax",
        },
    })
}))


// const pusherStore = create<PusherStore>((set, get) => ({
//     pusher: null,
//     initPusherStore: (userId: string) => {
//         const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
//             userAuthentication: {
//                 endpoint: "/api/pusher/auth-user",
//                 transport: "ajax",
//                 headers: {user_id: userId}
//             },
//             channelAuthorization: {
//                 endpoint: "/api/pusher/auth-channel",
//                 transport: "ajax",
//                 headers: {user_id: userId},
//             },
//             cluster: "us3",
//         });
//         pusher.signin();
//         set({
//             pusher: pusher
//         });
//     },
// }));

export default usePusherStore