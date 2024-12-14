export interface Auth{
    id?: number;
    username:string,
    roles:string
    secret_phrase:string
}

export interface AuthResponse {
    message?: string;
    error?: string;
    user?: Auth; 
  }
  
export interface AuthApi{
    // used register/login
    register: (auth: Auth) => Promise<AuthResponse>;
    login: (auth: Auth) => Promise<AuthResponse>;
}