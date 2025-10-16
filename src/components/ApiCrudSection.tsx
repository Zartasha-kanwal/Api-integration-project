import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserPlus, Edit3, Trash2, Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const ApiCrudSection = () => {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedValues, setEditedValues] = useState({ name: "", email: "" });
  const { toast } = useToast();

  // GET
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      return res.json();
    },
  });

  // POST
  const createUser = useMutation({
    mutationFn: async (user: Partial<User>) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) => [
        { ...data, id: Math.random() * 10000 },
        ...old,
      ]);
      setNewUser({ name: "", email: "" });

      toast({
        title: "✅ User Created",
        description: `${data.name || "New user"} has been added successfully.`,
      });
    },
  });

  // PUT
  const updateUser = useMutation({
    mutationFn: async (user: User) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data = await res.json();
      return { ...data, id: user.id };
    },
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      return { previousUsers };
    },
    onError: (_err, _user, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      toast({
        variant: "destructive",
        title: "❌ Update Failed",
        description: "Something went wrong while updating the user.",
      });
    },
    onSuccess: (user) => {
      toast({
        title: "✏️ User Updated",
        description: `${user.name} has been updated successfully.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // DELETE
  const deleteUser = useMutation({
    mutationFn: async (user: User) => {
      await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
        method: "DELETE",
      });
      return user;
    },
    onSuccess: (deletedUser) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.filter((u) => u.id !== deletedUser.id)
      );

      toast({
        variant: "destructive",
        title: "🗑️ User Deleted",
        description: `${deletedUser.name} has been removed.`,
      });
    },
  });

  // HANDLERS
  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditedValues({ name: user.name, email: user.email });
  };

  const saveEdit = () => {
    if (!editingUser) return;
    updateUser.mutate({ ...editingUser, ...editedValues });
    setEditingUser(null);
  };

  const cancelEdit = () => setEditingUser(null);

  return (
    <section className="py-28 lg:px-4">
      <div className="max-w-[80%] mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="md:text-4xl text-xl font-bold">User Management</h2>
          </div>
        </div>

        {/* Add User */}
        <div className="glass-card p-6 mb-12 lg:max-w-[60%] mx-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            Add a New User
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="flex-1 px-3 py-2 rounded-md bg-background border border-white/10"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="flex-1 px-3 py-2 rounded-md bg-background border border-white/10"
            />
            <Button
              onClick={() => createUser.mutate(newUser)}
              disabled={!newUser.name || !newUser.email}
            >
              Create
            </Button>
          </div>
        </div>

        {/* User List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-32 bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users?.slice(0, 9).map((user) => {
              const isEditing = editingUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editedValues.name}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full mb-2 px-3 py-2 rounded-md bg-background border border-white/10"
                      />
                      <input
                        type="email"
                        value={editedValues.email}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full mb-4 px-3 py-2 rounded-md bg-background border border-white/10"
                      />

                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm" onClick={saveEdit}>
                          <Check className="w-4 h-4 mr-2 text-emerald-400" />{" "}
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold mb-2 truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {user.email}
                      </p>

                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(user)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/10 hover:text-white"
                          onClick={() => deleteUser.mutate(user)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ApiCrudSection;
