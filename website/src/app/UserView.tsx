import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "./types";

export function UserView({ user }: { user: User }) {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-md">
      <Avatar>
        {user.image && <AvatarImage src={user.image} />}
        {user.name && (
          <AvatarFallback>
            {user.name.charAt(0).toUpperCase() +
              user.name.charAt(1).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
