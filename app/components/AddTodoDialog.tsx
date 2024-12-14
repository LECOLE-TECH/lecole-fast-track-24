import { useState } from 'react';
import { Button } from '~/components/ui/button';

interface AddTodoDialogProps {
  onAdd: (title: string) => void;
  onClose: () => void;
}

export function AddTodoDialog({ onAdd, onClose }: AddTodoDialogProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-4"
            placeholder="Enter todo title..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Add Todo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
