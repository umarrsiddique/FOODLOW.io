import { io } from 'socket.io-client'

// Single shared socket instance for the whole app. autoConnect is off so it only
// connects when a page actually needs live updates (My Orders / order confirmation).
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', { autoConnect: false })

export default socket
