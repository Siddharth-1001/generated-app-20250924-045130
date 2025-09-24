import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import type { Monitor } from '@shared/types';
const formSchema = z.object({
  subreddit: z.string().min(1, 'Subreddit is required').regex(/^[a-zA-Z0-9_]+$/, 'Invalid subreddit name'),
  keywords: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;
interface CreateMonitorDialogProps {
  monitorToEdit?: Monitor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children?: React.ReactNode;
}
export function CreateMonitorDialog({ monitorToEdit, isOpen, onOpenChange, children }: CreateMonitorDialogProps) {
  const createMonitor = useStore((state) => state.createMonitor);
  const updateMonitor = useStore((state) => state.updateMonitor);
  const isEditMode = !!monitorToEdit;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subreddit: '',
      keywords: '',
    },
  });
  useEffect(() => {
    if (isEditMode && monitorToEdit) {
      form.reset({
        subreddit: monitorToEdit.subreddit,
        keywords: monitorToEdit.keywords,
      });
    } else {
      form.reset({
        subreddit: '',
        keywords: '',
      });
    }
  }, [monitorToEdit, isEditMode, form, isOpen]);
  async function onSubmit(values: FormValues) {
    if (isEditMode && monitorToEdit) {
      await updateMonitor(monitorToEdit.id, values);
    } else {
      await createMonitor(values);
    }
    form.reset();
    onOpenChange(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Monitor' : 'Create a new monitor'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the details for r/${monitorToEdit.subreddit}.`
              : 'Enter a subreddit and optional keywords to track new posts from the last week.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="subreddit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subreddit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">r/</span>
                      <Input placeholder="reactjs" {...field} className="pl-7 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., state management, hooks" {...field} className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200">
                {form.formState.isSubmitting
                  ? isEditMode ? 'Saving...' : 'Creating...'
                  : isEditMode ? 'Save Changes' : 'Create Monitor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}