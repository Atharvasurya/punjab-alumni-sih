import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Alumni } from '@/types';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = {
    q: searchParams.get('q') || undefined,
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    branch: searchParams.get('branch') || undefined,
    company: searchParams.get('company') || undefined,
    skill: searchParams.get('skill') || undefined,
  };

  try {
    const alumni = db.getAlumni(filters);
    return NextResponse.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = requireAuth(request, ['admin']);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const alumniData = await request.json();
    
    // Generate ID if not provided
    if (!alumniData.id) {
      const existingAlumni = db.getAlumni();
      const maxId = existingAlumni.reduce((max, alumni) => {
        const num = parseInt(alumni.id.split('_')[1]);
        return num > max ? num : max;
      }, 0);
      alumniData.id = `al_${String(maxId + 1).padStart(4, '0')}`;
    }

    // Set timestamps
    const now = new Date().toISOString();
    alumniData.created_at = now;
    alumniData.updated_at = now;
    alumniData.role = 'alumni';

    // Initialize default values
    if (!alumniData.mentorship) {
      alumniData.mentorship = { isMentor: false, mentees: [] };
    }
    if (!alumniData.donations) {
      alumniData.donations = [];
    }
    if (!alumniData.past_jobs) {
      alumniData.past_jobs = [];
    }

    db.createUser(alumniData as Alumni);
    
    // Create audit log
    db.createAuditLog({
      id: `audit_${Date.now()}`,
      actorId: 'admin',
      actorRole: 'admin',
      action: 'CREATE_USER',
      targetType: 'alumni',
      targetId: alumniData.id,
      timestamp: now,
      details: `Created new alumni profile for ${alumniData.name}`
    });

    return NextResponse.json(alumniData, { status: 201 });
  } catch (error) {
    console.error('Error creating alumni:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
