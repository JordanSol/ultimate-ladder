import type { NextApiRequest, NextApiResponse } from 'next'
import { pusherServerClient } from '../../../server/helpers/pusher'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { socket_id } = req.body
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user?.id) {
    const auth = pusherServerClient.authenticateUser(socket_id, {
      id: session.user.id,
      name: session.user.name
    })
    res.send(auth)
  } else {
    res.status(401)
  }

}