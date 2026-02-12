import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Save, User, Bell, Palette, Shield } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  department: z.string().min(1, "Please select a department"),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      bio: "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Mock save - in real app this would dispatch an action
    console.log("Profile updated:", data);
    alert("Profile updated successfully!");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="cursor-pointer">
            <User className="mr-1.5 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="cursor-pointer">
            <Palette className="mr-1.5 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="cursor-pointer">
            <Bell className="mr-1.5 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="cursor-pointer">
            <Shield className="mr-1.5 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      type="button"
                      className="cursor-pointer"
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      {...register("department")}
                      className={errors.department ? "border-destructive" : ""}
                    />
                    {errors.department && (
                      <p className="text-xs text-destructive">
                        {errors.department.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={user?.role || "member"} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    {...register("bio")}
                    className="resize-none"
                    rows={3}
                  />
                  {errors.bio && (
                    <p className="text-xs text-destructive">
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isDirty}
                    className="cursor-pointer"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how ProjeX looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => setTheme("light", e)}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => setTheme("dark", e)}
                  >
                    Dark
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select the theme for the dashboard.
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={(e) => setTheme(t, e)}
                    className={`group relative rounded-xl border-2 p-1 transition-all cursor-pointer ${
                      theme === t
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-4 ${
                        t === "dark" ? "bg-zinc-900" : "bg-white"
                      }`}
                    >
                      <div className="space-y-2">
                        <div
                          className={`h-2 w-12 rounded ${t === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}
                        />
                        <div
                          className={`h-2 w-20 rounded ${t === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}
                        />
                        <div
                          className={`h-2 w-16 rounded ${t === "dark" ? "bg-zinc-700" : "bg-gray-200"}`}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium capitalize text-center pb-1">
                      {t}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "Task Assignments",
                  description: "Notify when a new task is assigned to you",
                  defaultChecked: true,
                },
                {
                  title: "Project Updates",
                  description: "Notify when a project you're in is updated",
                  defaultChecked: true,
                },
                {
                  title: "Comments & Mentions",
                  description: "Notify when someone comments or mentions you",
                  defaultChecked: true,
                },
                {
                  title: "Due Date Reminders",
                  description: "Remind you before a task is due",
                  defaultChecked: false,
                },
                {
                  title: "Weekly Summary",
                  description: "Receive a weekly summary of your progress",
                  defaultChecked: false,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <Label className="text-sm">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Change Password</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Update your password to keep your account secure
                  </p>
                  <div className="grid gap-3 max-w-sm">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button className="w-fit cursor-pointer">
                      Update Password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Active Sessions</Label>
                    <p className="text-xs text-muted-foreground">
                      Manage your active login sessions
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
