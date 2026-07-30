import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: BookingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      variant: 'secondary' as const,
      label: 'Pending',
    },
    CONFIRMED: {
      variant: 'default' as const,
      label: 'Confirmed',
    },
    COMPLETED: {
      variant: 'outline' as const,
      label: 'Completed',
    },
    CANCELLED: {
      variant: 'destructive' as const,
      label: 'Cancelled',
    },
      REJECTED: {
      variant: 'destructive' as const,
      label: 'Rejected',
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
