import { updateProfile } from '@/controllers/authController';

export async function PUT(req) {
  return updateProfile(req);
}
