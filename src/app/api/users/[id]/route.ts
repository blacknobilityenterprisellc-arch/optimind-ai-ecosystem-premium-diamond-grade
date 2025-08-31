<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
=======
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
<<<<<<< HEAD
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
        _count: {
          select: {
            conversations: true,
            projects: true,
            generatedImages: true,
            webSearches: true
          }
        }
      }
    })
=======
    });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
<<<<<<< HEAD
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
    const { name, avatar, role, status, emailVerified } = await request.json()
=======
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    const emailTaken = await db.user.findFirst({
      where: {
        email,
        id: { not: params.id },
      },
    });

    if (emailTaken) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 400 }
      );
    }
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

    const user = await db.user.update({
      where: { id: params.id },
      data: {
<<<<<<< HEAD
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(role && { role }),
        ...(status && { status }),
        ...(emailVerified !== undefined && { emailVerified })
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
        name,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await db.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}