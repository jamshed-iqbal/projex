import { useEffect } from "react";
import { Search, Mail, MoreHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTeamMembers } from "@/features/team/teamThunks";
import { setTeamSearchQuery } from "@/features/team/teamSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-gray-400",
};

const roleStyles: Record<
  string,
  { variant: "default" | "secondary" | "outline" }
> = {
  admin: { variant: "default" },
  manager: { variant: "secondary" },
  member: { variant: "outline" },
};

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const { members, isLoading, searchQuery } = useAppSelector(
    (state) => state.team,
  );

  useEffect(() => {
    if (members.length === 0) {
      dispatch(fetchTeamMembers());
    }
  }, [dispatch, members.length]);

  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.department.toLowerCase().includes(q) ||
      member.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            {members.length} members across the organization
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-9 w-64"
            value={searchQuery}
            onChange={(e) => dispatch(setTeamSearchQuery(e.target.value))}
          />
        </div>
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with status indicator */}
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background ${statusStyles[member.status]}`}
                    />
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-sm font-semibold">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {member.department}
                  </p>
                  <Badge
                    variant={roleStyles[member.role].variant}
                    className="mb-4"
                  >
                    {member.role}
                  </Badge>

                  {/* Stats */}
                  <div className="flex w-full gap-2 mb-4">
                    <div className="flex-1 rounded-lg bg-muted/50 px-2 py-1.5">
                      <p className="text-lg font-bold">
                        {member.tasksAssigned}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Assigned
                      </p>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted/50 px-2 py-1.5">
                      <p className="text-lg font-bold">
                        {member.tasksCompleted}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Completed
                      </p>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted/50 px-2 py-1.5">
                      <p className="text-lg font-bold">
                        {member.projects.length}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Projects
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 cursor-pointer"
                    >
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Email
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Assign Task</DropdownMenuItem>
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMembers.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No members found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}
