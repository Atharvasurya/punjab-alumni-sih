import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Alumni } from '@/types';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request, ['admin', 'collage']);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'alumni';

  try {
    let csvContent = '';
    
    if (type === 'alumni') {
      const alumni = db.getAlumni();
      
      // CSV Headers
      csvContent = 'ID,Name,Email,Phone,College,Degree,Branch,Year,GPA,Skills,Current Job Title,Current Company,Address\n';
      
      // CSV Data
      alumni.forEach((alumni: Alumni) => {
        const skills = alumni.skills.join(';');
        const row = [
          alumni.id,
          alumni.name,
          alumni.email,
          alumni.phone,
          alumni.college,
          alumni.degree,
          alumni.branch,
          alumni.year.toString(),
          alumni.gpa,
          skills,
          alumni.current_job.title,
          alumni.current_job.company,
          alumni.address || ''
        ].map(field => `"${field}"`).join(',');
        
        csvContent += row + '\n';
      });
    }

    // Create audit log
    db.createAuditLog({
      id: `audit_${Date.now()}`,
      actorId: role,
      actorRole: role,
      action: 'EXPORT_DATA',
      targetType: type,
      targetId: 'all',
      timestamp: new Date().toISOString(),
      details: `Exported ${type} data as CSV`
    });

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
