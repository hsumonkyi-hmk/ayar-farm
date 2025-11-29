import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty';

export function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldX className="text-red-500" />
          </EmptyMedia>
          <EmptyTitle>Access Denied</EmptyTitle>
          <EmptyDescription>
            You don't have permission to access this page. Admin privileges required.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
