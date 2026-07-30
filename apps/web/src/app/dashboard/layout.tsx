import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Toaster position="top-right" />
      <div className="flex min-h-screen bg-mist">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
