import { createServer } from 'http'
// import path from 'path'

import express from 'express'
import { Server } from 'socket.io'

const app = express()
export const PORT = process.env.PORT || 3001
export const server = createServer(app)
export const io = new Server(server)
