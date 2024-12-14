import React, { useState } from 'react';
import { userApi } from '../../api/userApi';
import type { User } from '../../types/interfaceUser';
import { toast } from 'react-toastify';

interface AddUserProps {
  onClose: () => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Thêm prop setProducts
}

export const AddUser = ({ onClose, setUsers }: AddUserProps) => {
  const [newUser, setNewUser] = useState<User>({
    username: '',
    roles: '',
    secret_phrase: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addedUser = await userApi.post(newUser);
      toast.success('Add product successfully!');
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add new User</h2>
      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="roles" className="block text-gray-700 font-bold mb-2">Roles:</label>
          <textarea
            id="roles"
            name="roles"
            value={newUser.roles}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="secret_phrase" className="block text-gray-700 font-bold mb-2">Secret Phrase:</label>
          <input
            type="text"
            id="secret_phrase"
            name="secret_phrase"
            value={newUser.secret_phrase}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add User
        </button>
      </form>
    </div>
  );
};
