import { Toaster } from "~/components/ui/toaster";
import type { Route } from "../track-one/+types";
import { AuthProvider, useAuth } from "./utils/contexts/authContext";
import UserList from "./components/userList";
import { RegisterLoginButton } from "./components/registerLoginButton";
import { UpdateSecretButton } from "./components/updateSecretButton";
import { useCallback, useEffect } from "react";
import { useToast, type toast } from "~/hooks/use-toast";
import { apiUpdateSecret } from "./utils/api";
import { Button } from "~/components/ui/button";
import { useWebSocketContext, WebSocketProvider } from "./utils/contexts/webSocketContext";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

function App(){
  const {user,logout,setUserContextSecret} = useAuth()
  const { toast } = useToast()
  const {socket,on,emit} = useWebSocketContext()

  useEffect(()=>{
    if(socket){
      on("new-user-registered",(data)=>{
        const {username} = data
        toast({
          title:"A new user has been registered",
          description:username+" has been registered"
        })
      })
    }
  },[socket,on])

  const handleUpdateSecretPhrase = useCallback(async (username:string,newSecretPhrase:string) => {
    try {
      await apiUpdateSecret(username, newSecretPhrase)
      setUserContextSecret(newSecretPhrase)
      toast({
          title: "Secret Updated",
          description: "The user's secret phrase has been successfully updated.",
      })
      return true
    } catch (error) {
      toast({
          title: "Error",
          description: 'Failed to update secret phrase',
          variant: "destructive",
      })
      return false
    }
  }, [ toast,user])

  const leaveRooms = useCallback(()=>{
    if(user)emit("leave-all-rooms",{username:user.username})
  },[user,emit])

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {user ? `Welcome, ${user.username} (${user.roles})` : 'Welcome, Guest'}
        </h1>
        <div className="flex space-x-4">
          {user?<UpdateSecretButton username={user.username} currentSecretPhrase={user.secretPhrase} onSubmit={handleUpdateSecretPhrase}/>:<></>}
          {user?<Button onClick={()=>{
            logout()
            leaveRooms()
          }}>Logout</Button>:<RegisterLoginButton />}
        </div>
      </div>
      <UserList/>
      <Toaster />
    </div>
  );
}

export default function TrackTwo() {
  return <WebSocketProvider url={import.meta.env.VITE_BACKEND_URL}>
    <AuthProvider>
      <App></App>
    </AuthProvider>
  </WebSocketProvider> 
}
