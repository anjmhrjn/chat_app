This is a real-time chat application built with Next.js (App Router), Socket.IO, and Tailwind CSS. It allows users to create or join chat rooms using a guest username. The app ensures secure communication and seamless user experience across multiple rooms.

✨ Features
🔌 Real-time messaging with WebSockets (Socket.IO)

🧑 Unique guest identification using JWT tokens

🛡️ Secure room access and message sending via token validation

💬 Multiple room support with unique usernames per room

💾 Persistent chat history fetched from backend API

⚡ Smooth UI:

Autosizing message input (like ChatGPT)

Scroll-to-bottom on new messages

Loading overlays and custom toast notifications

🗂️ Tech Stack
Frontend: Next.js (App Router), Tailwind CSS, React Context API

Backend: Node.js, Express, Socket.IO

Database: MongoDB with Mongoose

Auth: JWT (stateless, short-lived tokens with localStorage)

State Management: React Context for socket and loading states

📌 Notes
A guest ID is generated and stored in localStorage for unique identification.

Tokens are short-lived and auto-refreshed using a timer on the client.

Room members and message logs are stored in MongoDB.

Username collision is handled by associating both username and guest ID.

📄 License
MIT License