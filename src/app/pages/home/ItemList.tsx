"use client"

import { useState, useTransition } from "react";
import { createItem, toggleItem, deleteItem } from "@/app/shared/functions/item";

type Item = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

interface ItemListProps {
  items: Item[];
  userId: string;
}

export function ItemList({ items, userId }: ItemListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim()) return;

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", newDescription);
    formData.append("userId", userId);

    startTransition(async () => {
      const result = await createItem(formData);
      if (result.success) {
        setNewTitle("");
        setNewDescription("");
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleToggle = async (itemId: string) => {
    startTransition(async () => {
      const result = await toggleItem(itemId);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    startTransition(async () => {
      const result = await deleteItem(itemId);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Todo List</h2>
      
      {/* Add new item form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !newTitle.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No items yet. Add your first todo above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                item.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => handleToggle(item.id)}
                disabled={isPending}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {item.completed && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-medium ${item.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className={`text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                    {item.description}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                className="text-red-600 hover:text-red-800 p-1 transition-colors"
                title="Delete item"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}