import { getAllUsers, getUserByName, insertUser, setSecretPhrase, totalUser } from "../services/userService.js";
import jwt from "jsonwebtoken"
import { decrypt, encrypt } from "../utils/cyptoUtil.js";
import { getIoInstance } from "../utils/socket/socketServer.js";

export const registerUser = async (req, res) => {
  const { username, roles, secret_phrase } = req.body

  try {
    const existingUser = await getUserByName(username)

    if(existingUser){
      return res.status(409).json({message:"A user with that name has already existed"})
    }

    
    const encryptSecretPhrase = encrypt(secret_phrase)
    const newUser = await insertUser(username, roles, encryptSecretPhrase)
    const token = jwt.sign({...newUser,secretPhrase:secret_phrase},process.env.JWT_KEY,{expiresIn:"24h"})
    
    try{
      getIoInstance().emit("new-user-registered",{username})
    }
    catch(err){
      console.log(err)
    }
    
    res.cookie("token",token,{
      httpOnly:true,
      secure:true,
      maxAge:3600000*24
    })

    res.status(201).json({...newUser,secretPhrase:secret_phrase})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to register user" })
  }
}

export const loginUser = async (req,res)=>{
  let {username,secret_phrase} = req.body
  const loginUser = req.user

  if(loginUser){
    username=loginUser.username
    secret_phrase=loginUser.secret_phrase
  }

  try {
    const user = await getUserByName(username)
    if(!user) return res.status(400).json({message:"Username does not exist or password is incorrect"})

    const decryptedSecretPhrase = decrypt(user.secret_phrase)
    const isMatch =  decryptedSecretPhrase===secret_phrase
    if(!isMatch) return res.status(400).json({message:"Username does not exist or password is incorrect"})

    user.secret_phrase = decryptedSecretPhrase
    const token = jwt.sign({...user,secretPhrase:decryptedSecretPhrase},process.env.JWT_KEY,{expiresIn:"24h"})

    res.cookie("token",token,{
      httpOnly:true,
      secure:true,
      maxAge:3600000*24
    })

    res.json({...user,secretPhrase:decryptedSecretPhrase})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Failed to login"})
  }
}


export const logout = async (req,res)=>{
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
}

export const updateSecretPhrase = async (req,res)=>{
  const {user} = req
  const { username, secret_phrase } = req.body

  if(!user) return res.json(403).json({message:"You are not authorized to do this action"})
  
  if(user.roles==="user"&&user.username!==username) return res.json(403).json({message:"You are not authorized to change this user secret"})
  
  if(user.roles==="user"||user.roles==="admin"){
    try {
      setSecretPhrase(username,encrypt(secret_phrase))

      try{
        //If a password got changed then notify the admins
        console.log("Sending message to admin room from user: "+username)
        getIoInstance().to("admin-room").emit("user-change-secret",{username,secretPhrase:secret_phrase})
      }
      catch(err){
        console.log(err)
        console.log("Failed sending message to admin-room from user: "+username)
      }


      try{
        //If you are an admin and change another person secret then send a notification for that person
        if(user.roles==="admin"&&user.username!==username){
          console.log("Sending message to private-user-connection-"+username)
          getIoInstance().to("private-user-connection-"+username).emit("admin-change-secret",{username,secretPhrase:secret_phrase})
        } 
      }
      catch(err){
        console.log(err)
        console.log("Failed sending message to private-user-connection-"+username)
      }


      res.status(200).json({message:"Secret updated successfully"})
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Cannot update secret"})
    }
  }

}

export const getUsers = async (req, res) => {
  const {user} = req
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const searchName = req.query.searchName||""
  const offset = (page - 1) * limit

  try {
  const users = await getAllUsers(searchName,offset,limit)
    if(user?.roles!=="user"&&user?.roles!=="admin"){
      //Only admin and user can see the roles
      for(let i=0;i<users.length;i++){
        delete users[i].roles
      }
    }

    if(user?.roles!=="admin"){
      //Only admin can see the secret phrase
      for(let i=0;i<users.length;i++){
        delete users[i].secret_phrase
      }
    }

    if(user?.roles==="admin"){
      //Admin can see the secret phrase
      for(let i=0;i<users.length;i++){
        const decryptedSecretPhrase = users[i].secret_phrase
        delete users[i].secret_phrase
        users[i].secretPhrase=decrypt(decryptedSecretPhrase)
      }
    }

    const totalUsers = await totalUser()
    
    res.status(200).json({
      data:users,
      pagination:{
        currPage:page,
        totalPages: Math.ceil(totalUsers / limit),
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to load users" })
  }
}
