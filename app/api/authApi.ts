import axios from 'axios';
import type { Auth, AuthApi,AuthResponse } from '../types/interfaceAuth';

 const server = 'http://localhost:3000';
const apiRequest  = async<T>(method:string,url:string,data:Auth | null =null):Promise<T>=>{
    try{
        const config = {
            method,
            url,
            data,
            headers:data ?  { 'Content-Type': 'application/json' } : undefined, 
        }
        const response = await axios(config);
        return response.data
    } catch (error) {
        console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error);
        throw new Error("API request Auth failed");
      }
}

export const authApi:AuthApi ={
    register: (auth: Auth): Promise<AuthResponse> =>
        apiRequest<AuthResponse>('post', `${server}/api/register`, auth),
      login: (auth: Auth): Promise<AuthResponse> =>
        apiRequest<AuthResponse>('post', `${server}/api/login`, auth),
}