"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import SignoutButton from "@/components/auth/signout-button";
import { User } from "better-auth";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  // Safely split user name
  const nameParts = typeof user?.name === "string" ? user.name.split(" ") : [];
  const firstName = nameParts[0] || "User";
  const lastName = nameParts[1] || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.image as string}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback>
                  {firstName[0] ?? "U"}
                  {lastName[0] ?? ""}
                </AvatarFallback>
              </Avatar>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>
              {firstName} {lastName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                Referrals
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Upgrades
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ChevronsUpDown className="mr-2 h-4 w-4" />
              Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
