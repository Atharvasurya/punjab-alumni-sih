import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Event } from '@/types';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = db.getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const eventData = await request.json();
    
    // Generate ID if not provided
    if (!eventData.id) {
      const existingEvents = db.getAllEvents();
      const maxId = existingEvents.reduce((max, event) => {
        const num = parseInt(event.id.split('_')[1]);
        return num > max ? num : max;
      }, 0);
      eventData.id = `ev_${String(maxId + 1).padStart(3, '0')}`;
    }

    // Set timestamps and defaults
    const now = new Date().toISOString();
    eventData.created_at = now;
    eventData.organizer = role; // Use the current user's role as organizer
    
    if (!eventData.attendees) {
      eventData.attendees = [];
    }

    db.createEvent(eventData as Event);
    return NextResponse.json(eventData, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
