import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const db = Database.getInstance();

export async function GET(
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
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await request.json();
    const existingEvent = db.getEventById(params.id);
    
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user can update this event (organizer or admin)
    if (role !== 'admin' && existingEvent.organizer !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = db.updateEvent(params.id, updates);
    if (success) {
      const updatedEvent = db.getEventById(params.id);
      return NextResponse.json(updatedEvent);
    } else {
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existingEvent = db.getEventById(params.id);
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user can delete this event (organizer or admin)
    if (role !== 'admin' && existingEvent.organizer !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = db.deleteEvent(params.id);
    if (success) {
      return NextResponse.json({ message: 'Event deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
