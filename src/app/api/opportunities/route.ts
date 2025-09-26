import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Opportunity } from '@/types';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunities = db.getAllOpportunities();
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunityData = await request.json();
    
    // Generate ID if not provided
    if (!opportunityData.id) {
      const existingOpportunities = db.getAllOpportunities();
      const maxId = existingOpportunities.reduce((max, opp) => {
        const num = parseInt(opp.id.split('_')[1]);
        return num > max ? num : max;
      }, 0);
      opportunityData.id = `op_${String(maxId + 1).padStart(3, '0')}`;
    }

    // Set timestamps and defaults
    const now = new Date().toISOString();
    opportunityData.created_at = now;
    opportunityData.posted_by = role; // Use the current user's role as posted_by
    
    if (!opportunityData.applications) {
      opportunityData.applications = [];
    }
    if (!opportunityData.requirements) {
      opportunityData.requirements = [];
    }

    db.createOpportunity(opportunityData as Opportunity);
    return NextResponse.json(opportunityData, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
