// src/components/TodoDetail.tsx

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

type TodoDetailProps = {
  todoId: number;
};

type FetchTodoParams = {
  todoId: number;
  setTodo: Dispatch<SetStateAction<Todo | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

// Fetch a single todo by ID and update state accordingly
const fetchTodo = async ({
  todoId,
  setTodo,
  setLoading,
  setError,
}: FetchTodoParams): Promise<void> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const todo = await response.json();
    setTodo(todo);
    setLoading(false);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Unknown error when attempting to fetch todos.',
    );
    setLoading(false);
  }
};

/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodo({ todoId, setTodo, setLoading, setError });
  }, [todoId]);

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      {todo && (
        <div>
          <h1>Todo {todoId}</h1>
          <h2>Title: {todo.title}</h2>
          <h2>Completed</h2>
          <p>{todo.completed ? 'Completed' : 'Open'} Todo</p>
        </div>
      )}
      {error && <p>/error loading todo/i</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};
