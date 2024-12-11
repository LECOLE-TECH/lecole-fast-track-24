import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import type { newUser, User } from '../types'
import { apiLogin, apiLogout, apiRegister } from '../api'
import { useToast } from '~/hooks/use-toast'
import { useWebSocketContext } from './webSocketContext'

export interface AuthContextType {
    user:User|null
    login: (username: string, secretPhrase: string) => Promise<boolean>
    register: (newUser:newUser) => Promise<boolean>
    logout: () => void
    setUserContextSecret: (secret:string)=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()
  const { socket,on } = useWebSocketContext()

  useEffect(() => {
    // Check if user is already logged in
    apiLogin("","")
    .then(user => {
      if (user) {
        setUser(user)
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.username}!`,
        })
      }
    })
    .catch(err => console.error('Login failed: ', err))
  }, [])

  useEffect(()=>{
    if(socket){
      on("admin-change-secret",async ({username,secretPhrase})=>{
        try{
          const user = await apiLogin(username,secretPhrase)
          if(user) setUser(user)
          toast({
            title: "Password changed",
            description: `Your password has been changed by an admin, it is now: ${secretPhrase}`,
          })
        }
        catch(err){
          console.log(err)
        }
      })
    }
  },[socket,on,setUser])

  useEffect(()=>{
    //Connect to a room if user is login
    if(user) socket?.emit("join-private-room",{username:user?.username})
    if(user?.roles==="admin") socket?.emit("join-admin-room",{username:user?.username})
  },[user])

  const setUserContextSecret= useCallback(async (secret_phrase:string)=>{
    try{
      const newUser = await apiLogin(user?.username||"",secret_phrase)
      if(newUser)setUser(newUser)
      else throw new Error("Login attempt failed after changing password")
    }
    catch(error){
      console.log(error)
      toast({
        title: "Login Failed after changing password",
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: "destructive",
      })
    }
  },[setUser,user])

  const login = useCallback(async (username: string, secret_phrase: string) => {
    try {
      const userData = await apiLogin(username, secret_phrase)
      setUser(userData)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      })
      return true
    } catch (error) {
      setUser(null)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  const register = useCallback(async (newUser:newUser) => {
    const {username,roles,secretPhrase} = newUser
    try {
      const userData = await apiRegister(username, roles, secretPhrase)
      const loginUser = await apiLogin(username,secretPhrase)
      setUser(loginUser)
      toast({
        title: "Registration Successful",
        description: `Welcome, ${userData.username}!`,
      })
      return true
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: 'An error occurred during logout',
        variant: "destructive",
      })
    }
  }, [toast])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUserContextSecret }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}