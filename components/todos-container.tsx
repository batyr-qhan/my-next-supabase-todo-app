'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/database.types';
import { Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Todo = Database['public']['Tables']['todos']['Row'];

const TodosContainer = ({
  todos,
  getTodos,
  isLoading,
}: {
  todos: Todo[] | null;
  setTodos: React.Dispatch<React.SetStateAction<any>>;
  getTodos: () => void;
  isLoading: boolean;
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
      getTodos();
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ul className="bg-todocontainer rounded">
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="p-4 flex justify-between items-center border-b border-b-stroke last:border-b-0 hover:cursor-pointer group-hover:opacity-100 group"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                className="rounded-3xl"
                checked={todo.is_complete ?? undefined}
                onCheckedChange={async (checked) => {
                  console.log('this is checked', checked);
                  if (typeof checked === 'boolean') {
                    const supabase = createClient();
                    const { data, error } = await supabase
                      .from('todos')
                      .update({ is_complete: checked })
                      .eq('id', todo.id);

                    if (error) {
                      console.error('Error updating todo:', error);
                    } else {
                      console.log('Todo updated:', data);
                      getTodos();
                    }
                  }
                }}
              />
              <span className="">
                {todo.is_complete ? (
                  <del className="opacity-50">{todo.task}</del>
                ) : (
                  <span>{todo.task}</span>
                )}
              </span>
            </div>

            <Trash
              onClick={() => {
                handleDeleteTodo(todo.id);
              }}
              className="cursor-pointer hover:text-red-500 transition-colors duration-200 ease-in-out transform hover:scale-110 hover:rotate-12 text-stroke active:scale-95 active:rotate-0 active:text-stroke opacity-0 group-hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default TodosContainer;
