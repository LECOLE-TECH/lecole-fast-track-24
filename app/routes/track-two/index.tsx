import type { Route } from "../track-two/+types";
import React, { useState, useEffect } from "react";
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Two" }];
}

export default function TrackTwo() {
  const [isRegistering, setIsRegistering] = useState(false); // Quản lý trạng thái đăng nhập/đăng ký
  const [formData, setFormData] = useState({
    username: "",
    roles: "",
    secret_phrase: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response;
      if (isRegistering) {
        response = await authApi.register(formData);
      } else {
        response = await authApi.login(formData);
        console.log('login', response);  
      }
  
      if (response && response.message) {
        if (response?.user?.roles && response?.user?.id) {
          const { roles } = response.user;
          const { id } = response.user;
          localStorage.setItem('roles', roles);
          localStorage.setItem('userId', id.toString());
        } else {
          console.error('User ID is missing');
        }
      
      
        toast.success(response.message); 
        setIsRegistering(false); 
        setFormData({ username: "", roles: "", secret_phrase: "" }); 
        if (!isRegistering) {
          navigate('/dashboard-user');
        }
      }
      
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); 
      } else {
        toast.error('An unexpected error occurred!'); 
      }
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập username"
              required
            />
          </div>

          {/* Roles */}
          <div>
            <label htmlFor="roles" className="block text-sm font-medium text-gray-600">
              Roles
            </label>
            <input
              type="text"
              id="roles"
              name="roles"
              value={formData.roles}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập roles"
              required
            />
          </div>

          {/* Secret Phrase */}
          <div>
            <label htmlFor="secret_phrase" className="block text-sm font-medium text-gray-600">
              Secret Phrase
            </label>
            <input
              type="password"
              id="secret_phrase"
              name="secret_phrase"
              value={formData.secret_phrase}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập secret phrase"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isRegistering ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        {/* Toggle Form */}
        <div className="mt-4 text-center">
          {isRegistering ? (
            <p className="text-sm">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          ) : (
            <p className="text-sm">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-blue-500 hover:underline"
              >
                Đăng ký
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
