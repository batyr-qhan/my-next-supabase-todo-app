import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

export async function handleAddTodoServer(todoText: string, userId: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { data, error } = await supabase
    .from('todos')
    .insert([{ task: todoText, user_id: userId }]);
  if (error) {
    console.error('Error adding todo:', error);
    return error;
  } else {
    console.log('Todo added:', data);
    const { data: updatedTodos, error } = await supabase
      .from('todos')
      .select('*');
    return updatedTodos;
  }
}

export async function handleGetTodosServer() {
  const supabase: SupabaseClient<Database> = await createClient();
  const { data, error } = await supabase.from('todos').select('*');
  if (error) {
    console.error('Error getting todos:', error);
  } else {
    console.log('Todos:', data);
  }
  return data;
}

export async function handleDeleteTodo(todoId: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId);
  if (error) {
    console.error('Error deleting todo:', error);
    return error;
  } else {
    console.log('Todo deleted:', data);
    const { data: updatedTodos, error } = await supabase
      .from('todos')
      .select('*');
    return updatedTodos;
  }
}
