
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteRepository } from "@/services/repositoryData";

interface DeleteRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositoryId: string;
  repositoryName: string;
  onRepositoryDeleted: () => void;
}

export function DeleteRepositoryDialog({
  open,
  onOpenChange,
  repositoryId,
  repositoryName,
  onRepositoryDeleted
}: DeleteRepositoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      const success = deleteRepository(repositoryId);
      
      if (success) {
        toast.success("Repository deleted", {
          description: `"${repositoryName}" has been permanently deleted.`
        });
        onRepositoryDeleted();
      } else {
        toast.error("Failed to delete repository", {
          description: "The repository could not be found."
        });
      }
    } catch (error) {
      console.error("Error deleting repository:", error);
      toast.error("Failed to delete repository", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash className="h-5 w-5" />
            Delete Repository
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{repositoryName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
