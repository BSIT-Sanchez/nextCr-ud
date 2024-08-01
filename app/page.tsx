"use client"

import { useState, useEffect, FormEvent } from 'react';

// Define the shape of the post data
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newPost = { title, content, author };

    try {
      if (editingPostId) {
        // Update post
        await fetch(`/api/posts/${editingPostId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
        setEditingPostId(null);
      } else {
        // Create new post
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
      }

      // Clear form fields
      setTitle('');
      setContent('');
      setAuthor('');

      // Fetch posts again to update the list
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      fetchPosts(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setEditingPostId(post.id);
  };

  return (
    <div>
      <h1 className='text-center border p-2'>Posts</h1>

      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center mb-20' >
        <div className='flex justify-center item-center pb-2'>
          <label htmlFor="title">Title:</label>
          <input
            className='border'
            id="title"
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='flex justify-center item-center pb-2'>
          <label htmlFor="content">Content:</label>
          <textarea
           className='border'
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className='flex justify-center item-center pb-10'>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            className='border'
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button type="submit" className='text-center'>{editingPostId ? 'Update' : 'Submit'}</button>
      </form>

      <ul className='flex flex-col justify-center items-center'>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>By {post.author}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
