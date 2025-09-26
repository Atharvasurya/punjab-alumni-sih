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
    const alumni = db.getUserById(params.id);
    if (!alumni || alumni.role !== 'alumni') {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
    }
    return NextResponse.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
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
    const existingUser = db.getUserById(params.id);
    
    if (!existingUser || existingUser.role !== 'alumni') {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
    }

    // Check if user can update this profile (owner or admin)
    if (role !== 'admin' && existingUser.username !== role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = db.updateUser(params.id, updates);
    if (success) {
      // Create audit log
      db.createAuditLog({
        id: `audit_${Date.now()}`,
        actorId: role,
        actorRole: role,
        action: 'UPDATE_USER',
        targetType: 'alumni',
        targetId: params.id,
        timestamp: new Date().toISOString(),
        details: `Updated alumni profile`
      });

      const updatedUser = db.getUserById(params.id);
      return NextResponse.json(updatedUser);
    } else {
      return NextResponse.json({ error: 'Failed to update alumni' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating alumni:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = requireAuth(request, ['admin']);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existingUser = db.getUserById(params.id);
    if (!existingUser || existingUser.role !== 'alumni') {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
    }

    const success = db.deleteUser(params.id);
    if (success) {
      // Create audit log
      db.createAuditLog({
        id: `audit_${Date.now()}`,
        actorId: 'admin',
        actorRole: 'admin',
        action: 'DELETE_USER',
        targetType: 'alumni',
        targetId: params.id,
        timestamp: new Date().toISOString(),
        details: `Deleted alumni profile for ${existingUser.name}`
      });

      return NextResponse.json({ message: 'Alumni deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete alumni' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting alumni:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
