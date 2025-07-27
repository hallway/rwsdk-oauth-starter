"use server"

import { db } from "@/db";

export async function createItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const userId = formData.get("userId") as string;

    if (!title?.trim()) {
      return { success: false, error: "Item title is required" };
    }

    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const item = await db.item.create({
      data: {
        title: title.trim(),
        description: description?.trim() || undefined,
        userId,
      },
    });
    
    return { success: true, item };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false, error: "Failed to create item" };
  }
}

export async function getAllItems(userId: string) {
  const items = await db.item.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return items;
}

export async function toggleItem(itemId: string) {
  try {
    const item = await db.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    const updatedItem = await db.item.update({
      where: { id: itemId },
      data: {
        completed: !item.completed
      }
    });

    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Error toggling item:", error);
    return { success: false, error: "Failed to toggle item" };
  }
}

export async function deleteItem(itemId: string) {
  try {
    await db.item.delete({
      where: { id: itemId }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}