export interface User {
    id?: number;
    username: string;
    roles: string;
    secret_phrase: string;
  }
  
 
  export interface UserApi {
    get: () =>Promise<User[]>;
    post: (user: User) => Promise<User>;
    delete: (id: number) => Promise<void>;
    patch: (id: number, user: User) => Promise<User>;
  }
  