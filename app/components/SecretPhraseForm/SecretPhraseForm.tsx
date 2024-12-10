import React, { useState } from "react";

interface SecretPhraseFormProps {
  userId: string;
  currentPhrase?: string;
  onUpdate: (userId: string, newPhrase: string) => void;
  onClose: () => void;
}

export const SecretPhraseForm: React.FC<SecretPhraseFormProps> = ({
  userId,
  currentPhrase = "",
  onUpdate,
  onClose,
}) => {
  const [phrase, setPhrase] = useState(currentPhrase);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(userId, phrase);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Update Secret Phrase</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phrase" className="block mb-2">
              New Secret Phrase
            </label>
            <input
              type="text"
              id="phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
