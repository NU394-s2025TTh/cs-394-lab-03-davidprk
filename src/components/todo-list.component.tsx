// src/components/TodoList.tsx

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

type TodoListProps = {
  onSelectTodo: (id: number) => void;
};

type FetchTodosParams = {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setFilteredTodos: Dispatch<SetStateAction<Todo[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

type FilterOptions = 'All' | 'Open' | 'Completed';

/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.
 */
export const fetchTodos = async ({
  setTodos,
  setFilteredTodos,
  setLoading,
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const todos: Todo[] = await response.json();
    setTodos(todos);
    setFilteredTodos(todos);
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

export const filterTodos = (
  todos: Todo[],
  filterCriteria: FilterOptions,
  setFilteredTodos: Dispatch<SetStateAction<Todo[]>>,
): void => {
  let filtered: Todo[] = todos;
  if (filterCriteria === 'Open') {
    filtered = todos.filter((todo) => !todo.completed);
  } else if (filterCriteria === 'Completed') {
    filtered = todos.filter((todo) => todo.completed);
  }
  setFilteredTodos(filtered);
};

/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 */
export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterOptions>('All');

  useEffect(() => {
    fetchTodos({ setTodos, setFilteredTodos, setLoading, setError });
  }, []);

  useEffect(() => {
    filterTodos(todos, filterCriteria, setFilteredTodos);
  }, [todos, filterCriteria]);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>
        These are the filter buttons. The tests depend on the data-testids; and use
        provided styles. Implement click event handlers to change the filter state and
        update the UI accordingly to show just those todo&apos;s. other hints: you can
        change the styling of the button with <code>className</code> property. if the
        className of a button is &quot;active&quot; it will use the{' '}
        <code>.todo-button.completed</code> CSS style in App.css
      </p>
      <div className="filter-buttons">
        <button data-testid="filter-all" onClick={() => setFilterCriteria('All')}>
          All
        </button>
        <button data-testid="filter-open" onClick={() => setFilterCriteria('Open')}>
          Open
        </button>
        <button
          data-testid="filter-completed"
          onClick={() => setFilterCriteria('Completed')}
        >
          Completed
        </button>
      </div>
      <p>
        Show a list of todo&apos;s here. Make it so if you click a todo it calls the event
        handler onSelectTodo with the todo id to show the individual todo
      </p>
      {loading && <p>/loading todos/i</p>}
      {error && <p>Error loading todos: {error}</p>}
      {filteredTodos.map((todo) => (
        <div key={todo.id}>
          <button onClick={() => onSelectTodo(todo.id)}>Todo {todo.id}</button>
        </div>
      ))}
    </div>
  );
};
