import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Monitor } from '@shared/types';
interface DeleteMonitorAlertProps {
  monitor: Monitor;
  children: React.ReactNode;
}
export function DeleteMonitorAlert({ monitor, children }: DeleteMonitorAlertProps) {
  const deleteMonitor = useStore((state) => state.deleteMonitor);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDeleting(true);
    await deleteMonitor(monitor.id);
    // The dialog will close automatically as the component unmounts
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the monitor for{' '}
            <span className="font-semibold text-primary">r/{monitor.subreddit}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete monitor'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}