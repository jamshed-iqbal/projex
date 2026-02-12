import { useState, useEffect, useRef } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logoutUser } from "@/features/auth/authThunks";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { Button } from "@/components/ui/button";

function GuestBanner() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (bannerRef.current) {
      setHeight(bannerRef.current.scrollHeight);
    }
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 500);
  };

  const handleCreateAccount = async () => {
    await dispatch(logoutUser());
    navigate("/register");
  };

  if (dismissed) return null;

  return (
    <div
      ref={bannerRef}
      style={{
        maxHeight: visible ? height : 0,
        marginTop: visible ? undefined : 0,
        paddingTop: visible ? undefined : 0,
        paddingBottom: visible ? undefined : 0,
      }}
      className={`mx-4 mt-4 overflow-hidden rounded-lg border border-amber-500/30 bg-amber-500/10 transition-all duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Info className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="flex-1 text-sm text-amber-700 dark:text-amber-400">
          You&apos;re browsing as a <strong>Guest</strong>. Some features like
          profile editing and account settings are limited.{" "}
          <button
            onClick={handleCreateAccount}
            className="cursor-pointer font-medium underline underline-offset-4 hover:text-amber-800 dark:hover:text-amber-300"
          >
            Create an account
          </button>{" "}
          for full access.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-500/20 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isGuest = user?.id === "guest";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        {isGuest && <GuestBanner />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
