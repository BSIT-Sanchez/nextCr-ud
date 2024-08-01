// /api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const { title, content, author } = await request.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, author },
    });
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  try {
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}
