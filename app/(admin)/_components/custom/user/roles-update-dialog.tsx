"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { handleError } from "@/lib/zod-error";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";

const addRoleSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
});

export function ChangeUserRoleDialog({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const { data: allRoles } = api.user.getRoles.useQuery();

  const { data: userData } = api.user.getById.useQuery(userId, {
    enabled: open,
  });

  // Mutation for adding a role
  const addRoleMutation = api.user.addUserRole.useMutation({
    onSuccess: async () => {
      toast.success("Role added successfully");
      await utils.user.getById.invalidate(userId);
      await utils.user.getAll.invalidate();
      form.reset({ userId, roleId: "" });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Mutation for removing a role
  const removeRoleMutation = api.user.removeUserRole.useMutation({
    onSuccess: async () => {
      toast.success("Role removed successfully");
      await utils.user.getById.invalidate(userId);
      await utils.user.getAll.invalidate();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const form = useForm<z.infer<typeof addRoleSchema>>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      userId: userId,
      roleId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addRoleSchema>) => {
    addRoleMutation.mutate(values);
  };

  const handleRemoveRole = (roleId: string) => {
    removeRoleMutation.mutate({
      userId,
      roleId,
    });
  };

  // Current user roles
  const currentRoles =
    userData?.roles?.map((r) => ({
      id: r.id,
      name: r.name,
    })) || [];

  // Filter out roles the user already has
  const availableRoles =
    allRoles?.filter(
      (role) => !currentRoles.some((userRole) => userRole.id === role.id)
    ) || [];

  // Check if any mutation is in progress
  const isLoading = addRoleMutation.isPending || removeRoleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage User Roles</DialogTitle>
        </DialogHeader>

        {/* Display current roles */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Current Roles:</h3>
          <div className="flex flex-wrap gap-2">
            {currentRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            ) : (
              currentRoles.map((role) => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {role.name}
                  <DeleteConfirmationDialog
                    onConfirm={() => handleRemoveRole(role.id)}
                    itemName="shop"
                  >
                    <button
                      type="button"
                      className="rounded-full hover:bg-muted p-0.5"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {role.name} role</span>
                    </button>
                  </DeleteConfirmationDialog>
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Form to add new roles */}
        {availableRoles.length > 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="hidden"
                {...form.register("userId")}
                value={userId}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role to add" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !form.getValues().roleId}
                >
                  {addRoleMutation.isPending ? "Adding..." : "Add Role"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
