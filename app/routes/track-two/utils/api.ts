import type { User } from "./types"

export const apiLogin = async (username: string, secret_phrase: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, secret_phrase }),
        credentials: 'include'
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
    }
    return response.json()
}

export const apiRegister= async (username: string, roles: string, secret_phrase: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, roles, secret_phrase }),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
    }
    return response.json()
}

export const apiLogout= async (): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ||'Logout failed')
    }
}

export const apiGetUsers= async (page: number, limit: number): Promise<{ data: User[], pagination: { currPage: number, totalPages: number } }> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users?page=${page}&limit=${limit}`, {
        credentials: 'include'
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ||'Failed to fetch users')
    }
    return response.json()
}

export const apiUpdateSecret= async (username: string, secret_phrase: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-secret`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, secret_phrase }),
        credentials: 'include'
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ||'Failed to update secret phrase')
    }
}