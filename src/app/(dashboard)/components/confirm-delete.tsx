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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { usePlayerData, useTeamData } from "@/store/hooks";

const ConfirmDelete: React.FC<{ id: number; deleteType: string }> = (props) => {
  const { id, deleteType } = props;

  const { removePlayer } = usePlayerData();
  const { removeTeam } = useTeamData();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">x</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteType === "team" ? removeTeam(id) : removePlayer(id)
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDelete;
