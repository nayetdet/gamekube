import { friendshipService } from '@/services/friendship.service';

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get('page') ?? '0';
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
    return new Response(null, { status: 400 });
  }
  const friends = await friendshipService.listFriendsPage(Number(value), 8);
  return Response.json(friends, { headers: { 'Cache-Control': 'no-store' } });
}
