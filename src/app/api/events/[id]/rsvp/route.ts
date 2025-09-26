import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const db = Database.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const event = db.getEventById(params.id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if already RSVP'd
    if (event.attendees.includes(role)) {
      return NextResponse.json({ error: 'Already RSVP\'d to this event' }, { status: 400 });
    }

    const success = db.rsvpToEvent(params.id, role);
    if (success) {
      return NextResponse.json({ message: 'RSVP successful' });
    } else {
      return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error RSVP to event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
