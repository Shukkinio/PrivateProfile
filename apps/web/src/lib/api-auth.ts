import { createClient } from '@/lib/supabase/server';
import prisma from 'db';

export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) throw new Error('Unauthorized');

  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email || '' },
    create: {
      id: user.id,
      email: user.email || '',
      username: (user.user_metadata?.username as string) || user.email?.split('@')[0] || `user_${user.id.slice(0, 6)}`,
      avatar: user.user_metadata?.avatar_url as string || user.user_metadata?.picture as string || '',
    },
  });

  return dbUser;
}
