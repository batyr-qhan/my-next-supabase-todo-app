'use client';

import React, { useState } from 'react';
import { User } from '@supabase/auth-js';
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { Checkbox } from '@/components/ui/checkbox';

const InputTodoForm = ({
  user,
  getTodos,
}: {
  user: User;
  getTodos: () => void;
}) => {
  const [todoText, setTodoText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleAddTodo = async (todoText: string) => {
    const supabase: SupabaseClient<Database> = createClient();
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: todoText, user_id: user.id, is_complete: isComplete }]);

    if (error) {
      console.error('Error adding todo:', error);
      return error;
    } else {
      console.log('Todo added:', data);
      getTodos();
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleAddTodo(todoText);
        setTodoText('');
      }}
      className="mb-4"
    >
      <div className="relative">
        <Checkbox
          className="absolute ml-4 top-1/2 transform -translate-y-1/2 rounded-3xl"
          checked={isComplete}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              setIsComplete(checked);
            }
          }}
        />
        <input
          value={todoText}
          type="text"
          placeholder="Create a new todo"
          className="border border-gray-300 rounded-md p-4 w-full focus:outline-none border-none pl-12 bg-todocontainer"
          onChange={(e) => setTodoText(e.target.value)}
        />
      </div>
    </form>
  );
};

export default InputTodoForm;
