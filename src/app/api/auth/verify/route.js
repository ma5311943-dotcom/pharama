import { verifyOtp } from '@/controllers/authController';

export async function POST(req) {
  return verifyOtp(req);
}
