import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { format } from 'path';
import { useState } from 'react';
import { text } from 'stream/consumers';
import { setFlagsFromString } from 'v8';
import styles from '../styles/Home.module.css';
import { prisma } from '../lib/prisma';
import { useRouter } from 'next/router';
import { title } from 'process';

interface FormData {
  title: string;
  content: string;
  id: string;
}
interface Todos {
  todos: { id: string; title: string; content: string }[];
}
let edit = false;
const Home = ({ todos }: Todos) => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: '',
  });
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  async function create(data: FormData) {
    try {
      fetch('/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(() => {
        setForm({ title: '', content: '', id: '' }), refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteTodo(id: string) {
    try {
      fetch(`/api/todo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function editTodo(edId: string, edTitle: string, edContent: string) {
    edit = true;
    setForm({ id: edId, title: edTitle, content: edContent });

    console.log('Edit Pressed');
    console.log(edit);
  }
  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
      console.log('summited');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className='text-center font-bold text-2xl mt-4'>Todo</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'
      >
        <input
          type='text'
          placeholder='Title'
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className='border-2 rounded border-gray-600 p-1'
        />
        <textarea
          placeholder='Content'
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className='border-2 rounded border-gray-600 p-1'
        />
        <button type='submit' className='bg-blue-500 text-white rounded p-1'>
          Submit
        </button>
      </form>
      <div className='w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch'>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id} className='border-b border-gray-600 p-2'>
              <div className='flex justify-between'>
                <div className='flex-1'>
                  <h3 className='font-bold'>{todo.title}</h3>
                  <p className='text-sm'>{todo.content}</p>
                </div>
                <button
                  onClick={() => {
                    editTodo(todo.id, todo.title, todo.content);
                  }}
                  className='bg-yellow-500 px-3 text-white rounded'
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className='bg-red-500 px-3 text-white rounded'
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
export const getServerSideProps: GetServerSideProps = async () => {
  const todos = await prisma.todo.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });
  return {
    props: {
      todos,
    },
  };
};
