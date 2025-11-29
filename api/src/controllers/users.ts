import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export class UsersController {
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          phone_number: true,
          email: true,
          user_type: true,
          isVerified: true,
          profile_picture: true,
          location: true,
          gender: true,
          created_at: true,
        },
      });
      res.json({ data: users });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users', error: String(error) });
    }
  }
}
