import create from 'zustand'
import PusherJS from 'pusher-js'
import { env } from '../../env/client.mjs'

type PusherStore = {
    pusher: PusherJS;
}


const usePusherStore = create<PusherStore>(() => ({
    pusher: new PusherJS(env.NEXT_PUBLIC_PUSHER_KEY, {
        wsHost: env.NEXT_PUBLIC_PUSHER_HOST,
        wsPort: Number(env.NEXT_PUBLIC_PUSHER_PORT),
        wssPort: Number(env.NEXT_PUBLIC_PUSHER_PORT),
        forceTLS: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
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