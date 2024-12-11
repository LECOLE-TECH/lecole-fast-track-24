import { getUserByName } from "../../services/userService.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected")
    
    socket.on("join-private-room",async ({username})=>{
      const existingUser = await getUserByName(username)
      if(existingUser){
        console.log("Private room created: "+username)
        socket.join("private-user-connection-"+username)
      }
    })
    
    socket.on("join-admin-room",async({username})=>{
      const existingUser = await getUserByName(username)
      if(existingUser?.roles==="admin"){
        console.log("Admin "+username+" has joined the admin room")
        socket.join("admin-room")
      }
    })

    socket.on("leave-all-rooms",async({username})=>{
      console.log(username+" leaving all room")
      const existingUser = await getUserByName(username)
      if(existingUser)socket.leave("private-user-connection-"+username)
      if(existingUser?.roles==="admin") socket.leave("admin-room") 
    })

    socket.on("new-user-added",async(data)=>{
        const {username} = data
        io.emit("new-user-registered",{username})
    })


    socket.on("disconnect", () => console.log("User disconnected"))
  })
};
