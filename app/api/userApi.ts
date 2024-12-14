import axios from "axios";
import type { User,UserApi } from "~/types/interfaceUser";
const server = 'http://localhost:3000'
 const apiRequest = async<T>(method:string,url:string,data:User | null = null):Promise<T>=>{
   try{
    const config = {
        method, 
        url,
        data,
        headers:data  ? {'Content-Type':'application/json'} :undefined
    };
    const reponse = await axios(config)
    return reponse.data
   }catch(error){
    console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error("API request user failed");
   }
 }

export const userApi:UserApi = {
    get:()=> apiRequest<User[]>('get',`${server}/api/user`),
    post:(user:User)=>apiRequest<User>('post',`${server}/api/user`,user),
    patch:(id:number,user:User)=> apiRequest<User>('patch',`${server}/api/user/${id}`,user),
    delete:(id:number)=>apiRequest<void>('delete',`${server}/api/user/${id}`)
}