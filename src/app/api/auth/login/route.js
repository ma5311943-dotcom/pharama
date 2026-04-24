import { login } from '@/controllers/authController';

export async function POST(req) {
  return login(req);
}
