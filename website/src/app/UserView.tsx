import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export function UserView({ user }: { user: User }) {
  return (
    <Card className="pt-6">
      <CardContent className="flex gap-2 items-center">
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
      </CardContent>
    </Card>
  );
}
