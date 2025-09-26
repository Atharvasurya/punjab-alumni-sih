import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Message } from '@/types';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const withUserId = searchParams.get('with');

  try {
    const messages = db.getMessages(role, withUserId || undefined);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { to, message } = await request.json();
    
    if (!to || !message) {
      return NextResponse.json({ error: 'Recipient and message are required' }, { status: 400 });
    }

    // Generate message ID
    const existingMessages = db.getMessages(role);
    const maxId = existingMessages.reduce((max, msg) => {
      const num = parseInt(msg.id.split('_')[1]);
      return num > max ? num : max;
    }, 0);

    const messageData: Message = {
      id: `msg_${String(maxId + 1).padStart(3, '0')}`,
      from: role,
      to,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    db.createMessage(messageData);
    return NextResponse.json(messageData, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
