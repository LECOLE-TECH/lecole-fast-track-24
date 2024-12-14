import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { AddUser } from "~/components/ui/addUser";
import { userApi } from "~/api/userApi";
import type { User } from "~/types/interfaceUser";
import { toast } from 'react-toastify';
import { EditUser } from "~/components/ui/editUser";
import io from 'socket.io-client';

const socket = io("http://localhost:3000"); 

const DashboardUser = () => {
  const [roles, setRoles] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.get(); 
      if (Array.isArray(response.users)) {
        setUsers(response.users); 
      } else {
        setUsers([]); 
      }
    } catch (error) {
      setUsers([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const userRoles = localStorage.getItem('roles');
    const userId = localStorage.getItem('userId');
    console.log('userid', userId);
    
    setRoles(userRoles);
  }, []);
  useEffect(() => {
    socket.on("secret-phrase-updated", (data) => {
      const { userId, newSecretPhrase } = data;
      console.log('data',data)
      console.log(`Secret phrase updated for user ${userId}: ${newSecretPhrase}`);
      
      toast.success('Secret phrase updated successfully!');

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, secret_phrase: newSecretPhrase } : user
        )
      );
    });
  
    return () => {
      socket.off("secret-phrase-updated");
    };
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await userApi.delete(userId);
      toast.success('User deleted successfully!');
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleUpdateSecretPhrase = (updatedUser: User) => {
    if (selectedUser) {
      const actorId = localStorage.getItem('userId');
      const userId = selectedUser.id;
      socket.emit("update-secret-phrase", {
        userId,
        newSecretPhrase: updatedUser.secret_phrase,
        actorId,
      });
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 p-8 shadow-md sm:rounded-lg">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          User List
        </h2>
      </header>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your product inventory is just a click away.
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          Manage, update, and add users easily! Make your workflow seamless with our intuitive interface.
        </p>
      </div>

      {roles === 'admin' && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          >
            <FaPlus />
            <span>Add User</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div> 
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Roles</th>
                <th className="px-6 py-3 text-left">Secret phrase</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                    <td className="px-6 py-4 text-left">{user.id}</td>
                    <td className="px-6 py-4 text-left">{user.username}</td>
                    <td className="px-6 py-4 text-left">{user.roles}</td>
                    <td className="px-6 py-4 text-left">{user.secret_phrase}</td>
                    <td className="flex space-x-2 px-6 py-4">
                      {(roles === 'admin' || user.id === parseInt(localStorage.getItem('userId') || '')) && (
                        <>
                          <button className="bg-blue-500 text-white py-1 px-2 rounded-full">
                            <FaEdit onClick={() => handleEdit(user)} />
                          </button>
                          <button className="bg-red-500 text-white py-1 px-2 rounded-full">
                            <FaTrashAlt onClick={() => user.id && handleDelete(user.id)} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            {selectedUser ? (
              <EditUser
                user={selectedUser}
                onClose={closeModal}
                onSave={handleUpdateSecretPhrase} 
                setUsers={setUsers}
              />
            ) : (
              <AddUser onClose={closeModal} setUsers={setUsers} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
