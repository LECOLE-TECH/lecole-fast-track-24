import React, { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useAuth } from '../utils/contexts/authContext'
import { RegisterForm } from './registerForm'
import { LoginForm } from './loginForm'
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '~/components/ui/dialog'
import type { newUser } from '../utils/types'


export const RegisterLoginButton = () => {
  const { user, login, register, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isRegisterMode,setIsRegisterMode] = useState(false)

  const handleSubmitRegisterForm = useCallback(async (newUser:newUser)=>{
    const res = await register(newUser)
    if(res) setIsOpen(false)
    return res
  },[])

  const handleSubmitLoginForm = useCallback(async(username:string,secret_phrase:string)=>{
    const res = await login(username,secret_phrase)
    if(res) setIsOpen(false)
    return res
  },[])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => user ? logout() : setIsOpen(true)}>
          Login/Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {isRegisterMode?
            <RegisterForm onSubmit={handleSubmitRegisterForm}/>
        :
            <LoginForm onSubmit={handleSubmitLoginForm}/>
        }
        <Button onClick={()=>setIsRegisterMode(!isRegisterMode)} className='bg-black text-white'>{isRegisterMode?"Already have an account? Login":"Don't have an account? Register"}</Button>
      </DialogContent>
    </Dialog>
  )
}

