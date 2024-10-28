import {
  handleAddTodoServer,
  handleGetTodosServer,
} from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Request body:', request.body);
  const { todoText, userId } = await request.json();

  try {
    const data = await handleAddTodoServer(todoText, userId);
    console.log('Data:', data);
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Error adding todo', { status: 500 });
  }
}

export async function GET() {
  // return NextResponse.json({ message: 'Hello' });

  try {
    const todos = await handleGetTodosServer();

    return new Response(JSON.stringify(todos), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Error getting todos', { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { todoId } = await request.json();
  console.log('Request body:', request.body);
  console.log('todoId:', todoId);
  try {
    const data = await handleDeleteTodo(todoId);
    console.log('Data:', data);
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Error deleting todo', { status: 500 });
  }
}