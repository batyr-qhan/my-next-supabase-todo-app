'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ITodo } from '@/types/todo';
import { Database, Tables } from '@/database.types';
import { Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Todo = Database['public']['Tables']['todos']['Row'];

const TodosContainer = ({
  todos,
  setTodos,
}: {
  todos: Todo[] | null;
  setTodos: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const handleDeleteTodo = async (todoId: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);
    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      console.log('Todo deleted:', data);
      const { data: updatedTodos, error } = await supabase
        .from('todos')
        .select('*');

      if (error) {
        console.error('Error getting todos:', error);
      }

      setTodos(updatedTodos);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Your Todos</h2>
      <ul>
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="border p-2 rounded mb-2 flex justify-between items-center "
          >
            <Checkbox className='rounded-3xl' />
            {todo.task}
            <Trash
              onClick={() => {
                handleDeleteTodo(todo.id);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosContainer;
