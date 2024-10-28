'use client';

import { redirect } from 'next/navigation';
import InputTodoForm from '@/components/input-todo-form';
import TodosContainer from '@/components/todos-container';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

type Todo = Database['public']['Tables']['todos']['Row'];

export default function TodosPage() {
  const supabase: SupabaseClient<Database> = createClient();

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect('/sign-in');
      } else {
        setUser(user);
        getTodos();
      }
    };

    checkUser();
  }, []);

  const getTodos = async () => {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) {
      console.error('Error getting todos:', error);
    } else {
      console.log('Todos:', data);
      setTodos(data);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-1/2">
        <div>
          <h1 className="text-2xl font-bold mb-4">Todos</h1>
        </div>
        <InputTodoForm user={user} setTodos={setTodos} />
        <TodosContainer todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
}
