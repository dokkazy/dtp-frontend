'use client'
import SidebarBreadcrumb from "@/components/common/SideBar/SidebarBreadcrumb";
import { SidebarDashboard } from "@/components/common/SideBar/SideBarDashboard";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, User } from "lucide-react";
const adminItems = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/admin/dashboard/users",
        icon: User,

    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <SidebarDashboard title="Admin" items={adminItems} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* breadcrum */}
                        <SidebarBreadcrumb />
                    </div>
                </header>
                <div className="ml-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}