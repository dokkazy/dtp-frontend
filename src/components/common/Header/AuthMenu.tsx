/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  ChevronLeft,
  Globe,
  Lock,
  LogOut,
  Moon,
  Settings,
  User,
  Bell,
  Check,
  ShoppingBag,
  MessageSquareText,
} from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

import { cn, handleErrorApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import authApiRequest from "@/apiRequests/auth";
import { links } from "@/configs/routes";
import { useAuthContext } from "@/providers/AuthProvider";
import { AUTH_SYNC_KEY } from "@/components/common/UserInitializer";
// Define menu types for better type safety
type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  hasSubmenu?: boolean;
  isDanger?: boolean;
  submenu?: MenuItem[];
};

export default function AuthMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { setUser } = useAuthContext();
  const [menuStack, setMenuStack] = React.useState<string[]>([]);
  const router = useRouter();

  async function handleLogOut() {
    try {
      const response: any =
        await authApiRequest.logoutFromNextClientToNextServer();
      if (!response.payload.success) {
        console.error(response.payload.message);
        return;
      }
      setUser(null);
      toast.success(response.payload.message);
      setOpen(false);
      localStorage.removeItem(AUTH_SYNC_KEY);
      location.href = links.home.href;
    } catch (error) {
      console.error("Logout error:", error);
      handleErrorApi(error);
      // If the error is due to an expired session token, redirect to login
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        setUser(null);
        localStorage.removeItem(AUTH_SYNC_KEY);
        setTimeout(() => {
          window.location.replace(
            `${links.login.href}?redirectFrom=${pathname}`,
          );
        }, 2000);
      });
    }
  }

  // Get current menu based on navigation stack
  const getCurrentMenu = () => {
    let currentMenu = menuItems;

    for (const menuId of menuStack) {
      const foundItem = findMenuItemById(currentMenu, menuId);
      if (foundItem && foundItem.submenu) {
        currentMenu = foundItem.submenu;
      }
    }

    return currentMenu;
  };

  // Helper to find a menu item by ID
  const findMenuItemById = (
    items: MenuItem[],
    id: string,
  ): MenuItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenu) {
        const found = findMenuItemById(item.submenu, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Navigate to a submenu
  const navigateToSubmenu = (menuId: string) => {
    setMenuStack([...menuStack, menuId]);
  };

  // Navigate back to previous menu
  const navigateBack = () => {
    setMenuStack(menuStack.slice(0, -1));
  };

  // Reset navigation when popover closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setMenuStack([]);
    }
  };

  // Get current menu title
  const getCurrentMenuTitle = (): string => {
    if (menuStack.length === 0) return "";

    const currentMenuId = menuStack[menuStack.length - 1];
    const item = findMenuItemById(menuItems, currentMenuId);
    return item?.label || "";
  };

  // Define all menu items with their submenus
  const menuItems: MenuItem[] = [
    {
      id: "profile",
      label: "Trang cá nhân",
      icon: User,
      onClick: () => {
        router.push(links.profile.href);
        setOpen(false);
      },
    },
    {
      id:"review",
      label:"Đánh giá",
      icon: MessageSquareText,
    },
    {
      id: "cart",
      label: "Đơn hàng",
      icon: ShoppingBag,
      onClick: () => {
        router.push(links.orders.href);
        setOpen(false);
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          onClick: () => setOpen(false),
        },
        {
          id: "appearance",
          label: "Appearance",
          icon: Moon,
          onClick: () => setOpen(false),
        },
        {
          id: "language",
          label: "Language",
          icon: Globe,
          hasSubmenu: true,
          submenu: [
            {
              id: "english",
              label: "English",
              icon: Check,
              onClick: () => setOpen(false),
            },
            {
              id: "spanish",
              label: "Spanish",
              icon: Check,
              onClick: () => setOpen(false),
            },
            {
              id: "french",
              label: "French",
              icon: Check,
              onClick: () => setOpen(false),
            },
            {
              id: "german",
              label: "German",
              icon: Check,
              onClick: () => setOpen(false),
            },
            {
              id: "japanese",
              label: "Japanese",
              icon: Check,
              onClick: () => setOpen(false),
            },
          ],
        },
        {
          id: "privacy",
          label: "Privacy",
          icon: Lock,
          onClick: () => setOpen(false),
        },
      ],
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: LogOut,
      isDanger: true,
      onClick: () => handleLogOut(),
    },
  ];

  const currentMenu = getCurrentMenu();
  const currentTitle = getCurrentMenuTitle();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent autoFocus={false} className="z-[9999991] w-[240px] p-0">
        {menuStack.length > 0 && (
          <div className="flex items-center border-b p-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8"
              onClick={navigateBack}
              tabIndex={-1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">{currentTitle}</span>
          </div>
        )}

        <div className="flex flex-col">
          {currentMenu.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && item.isDanger && (
                <div className="my-1 h-px bg-border" />
              )}
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center rounded-none",
                  item.hasSubmenu ? "justify-between" : "justify-start gap-2",
                  item.isDanger && "text-destructive hover:text-destructive",
                )}
                onClick={
                  item.hasSubmenu
                    ? () => navigateToSubmenu(item.id)
                    : item.onClick
                }
                tabIndex={-1}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                )}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
