import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userApi } from '~/api/userApi';
import type { User } from '~/types/interfaceUser';

interface EditUserProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;  // Adjusted for clarity
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const EditUser = ({ user, onClose, onSave, setUsers }: EditUserProps) => {
  const [editedUser, setEditedUser] = useState<User>(user);

  useEffect(() => {
    setEditedUser(user);  // Ensure that the form resets if the user prop changes
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user.id;

    if (userId === undefined || isNaN(userId)) {
      toast.error('Invalid user ID');
      return;
    }

    // Ensure that all fields are properly filled
    const updatedUser = {
      ...editedUser,
      username: editedUser.username.trim() ?? '',
      roles: editedUser.roles.trim() ?? '',
      secret_phrase: editedUser.secret_phrase.trim() ?? '',
    };

    // Validation
    if (!updatedUser.username || !updatedUser.roles || !updatedUser.secret_phrase) {
      toast.error('All fields must be filled!');
      return;
    }

    try {
      const response = await userApi.patch(userId, updatedUser);
      if (response) {
        toast.success('User updated successfully!');
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
        onSave(updatedUser);
        onClose();
      } else {
        toast.error('Error updating user!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleEditUser} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={editedUser.username}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="roles" className="block text-gray-700 font-bold mb-2">Roles:</label>
          <input
            type="text"
            id="roles"
            name="roles"
            value={editedUser.roles}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="secret_phrase" className="block text-gray-700 font-bold mb-2">Secret Phrase:</label>
          <input
            type="text"
            id="secret_phrase"
            name="secret_phrase"
            value={editedUser.secret_phrase}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
