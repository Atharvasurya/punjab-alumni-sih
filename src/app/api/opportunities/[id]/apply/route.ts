import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const db = Database.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = requireAuth(request, ['students', 'alumni']);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunity = db.getOpportunityById(params.id);
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = opportunity.applications.find(app => app.userId === role);
    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied to this opportunity' }, { status: 400 });
    }

    const success = db.applyToOpportunity(params.id, role);
    if (success) {
      return NextResponse.json({ message: 'Application submitted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error applying to opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
