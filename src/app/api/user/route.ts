import { getUser } from '@/actions/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  if (user) {
    return NextResponse.json(user);
  }
  return new Response('Unauthorized', { status: 401 });
}
