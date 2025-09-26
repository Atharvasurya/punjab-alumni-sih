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
    const opportunity = db.getOpportunityById(params.id);
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }
    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
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
    const existingOpportunity = db.getOpportunityById(params.id);
    
    if (!existingOpportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if user can update this opportunity (owner or admin)
    if (role !== 'admin' && existingOpportunity.posted_by !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = db.updateOpportunity(params.id, updates);
    if (success) {
      const updatedOpportunity = db.getOpportunityById(params.id);
      return NextResponse.json(updatedOpportunity);
    } else {
      return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating opportunity:', error);
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
    const existingOpportunity = db.getOpportunityById(params.id);
    if (!existingOpportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if user can delete this opportunity (owner or admin)
    if (role !== 'admin' && existingOpportunity.posted_by !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = db.deleteOpportunity(params.id);
    if (success) {
      return NextResponse.json({ message: 'Opportunity deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
