import type { NextApiRequest, NextApiResponse } from 'next'
import { pusherServerClient } from '../../../server/helpers/pusher'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channel_name, socket_id } = req.body
  const { user_id } = req.headers

  if (!user_id || typeof user_id !== 'string') {
    res.status(404).send('Unauthorized')
    return
  }
  const user = await prisma.user.findUnique({
    where: {
        id: user_id
    }
  });

  const auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
    user_id,
    user_info: {
      name: `${user?.name ? user.name : 'User'}`,
    },
  })
  res.send(auth)
}