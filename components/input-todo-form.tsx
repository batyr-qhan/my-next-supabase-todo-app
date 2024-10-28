'use client';

import React, { useState } from 'react';
import { handleAddTodoServer } from '@/utils/supabase/server';
import { User } from '@supabase/auth-js';
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { Checkbox } from '@/components/ui/checkbox';
// import { createClient } from '@/utils/supabase/client';

const InputTodoForm = ({
  user,
  setTodos,
}: {
  user: User;
  setTodos: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [todoText, setTodoText] = useState('');

  const handleAddTodo = async (todoText: string) => {
    const supabase: SupabaseClient<Database> = createClient();
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: todoText, user_id: user.id }]);

    if (error) {
      console.error('Error adding todo:', error);
      return error;
    } else {
      console.log('Todo added:', data);
      const { data: updatedTodos, error } = await supabase
        .from('todos')
        .select('*');
      setTodos(updatedTodos);
    }
  };

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleAddTodo(todoText);
          setTodoText('');
        }}
      >
        <div className="relative">
          <Checkbox className='absolute ml-2 top-1/2 transform -translate-y-1/2 rounded-3xl' />
          <input
            value={todoText}
            type="text"
            placeholder="Create a new todo"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none border-none pl-8"
            onChange={(e) => setTodoText(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default InputTodoForm;
