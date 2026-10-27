import type { Metadata } from 'next';
import { friendshipService } from '@/services/friendship.service';
import { PageHeader } from '@/components/common/page-header';
import { AddFriendDialog } from '@/components/friendship/add-friend-dialog';
import { RequestList } from '@/components/friendship/request-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = { title: 'Pedidos de amizade' };

export default async function FriendRequestsPage() {
  const [received, sent] = await Promise.all([
    friendshipService.listReceivedRequests(),
    friendshipService.listSentRequests(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Pedidos de amizade"
        description="Responda o que chegou e acompanhe o que você enviou."
        actions={<AddFriendDialog />}
      />

      <Tabs defaultValue="received" className="space-y-5">
        <TabsList>
          <TabsTrigger value="received">
            Recebidos
            {received.length > 0 ? ` (${received.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="sent">
            Enviados
            {sent.length > 0 ? ` (${sent.length})` : ''}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <RequestList requests={received} direction="received" />
        </TabsContent>
        <TabsContent value="sent">
          <RequestList requests={sent} direction="sent" />
        </TabsContent>
      </Tabs>
    </>
  );
}
