// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content, author } = await request.json();
  const newPost = await prisma.post.create({
    data: { title, content, author },
  });
  return NextResponse.json(newPost);
}
