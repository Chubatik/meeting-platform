import { createServer } from 'http'

import { Server } from 'socket.io'
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const express = require('express')

export const app = express()
export const PORT = process.env.PORT || 3001
export const server = createServer(app)
export const io = new Server(server)
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const path = require('path')
