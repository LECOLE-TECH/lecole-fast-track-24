import React, { useState, useCallback, useMemo } from "react";
import type { User } from "@/types/index";
import { useAuth } from "@/context/AuthContext";
import { Pagination } from "@/components/Pagination/Pagination";
import { SecretPhraseForm } from "../SecretPhraseForm/SecretPhraseForm";
import { useWebSocket } from "@/hooks/useWebSocket";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const onUserUpdate = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
  }, []);

  useWebSocket(onUserUpdate);

  const columns = useMemo(() => {
    if (!currentUser) {
      return ["Username"];
    }
    if (currentUser.role === "admin") {
      return ["Username", "Role", "Secret Phrase", "Actions"];
    }
    return ["Username", "Role", "Secret Phrase"];
  }, [currentUser]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage]);

  const handleUpdateSecretPhrase = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handlePhraseUpdate = async (userId: string, newPhrase: string) => {
    // Implement API call to update phrase
    console.log("Updating phrase for user", userId, newPhrase);
    setSelectedUserId(null);
  };

  const renderUserRow = (user: User) => {
    if (!currentUser) {
      return (
        <tr key={user.id}>
          <td className="px-4 py-2">{user.username}</td>
        </tr>
      );
    }

    return (
      <tr key={user.id}>
        <td className="px-4 py-2">{user.username}</td>
        <td className="px-4 py-2">{user.role}</td>
        {(currentUser.role === "admin" || currentUser.id === user.id) && (
          <>
            <td className="px-4 py-2">{user.secretPhrase}</td>
            <td className="px-4 py-2">
              <button
                onClick={() => handleUpdateSecretPhrase(user.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Update Secret
              </button>
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div>
      <table className="min-w-full border">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2 bg-gray-100">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{paginatedUsers.map(renderUserRow)}</tbody>
      </table>

      <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {selectedUserId && (
        <SecretPhraseForm
          userId={selectedUserId}
          currentPhrase={
            users.find((u) => u.id === selectedUserId)?.secretPhrase
          }
          onUpdate={handlePhraseUpdate}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default UserTable;
