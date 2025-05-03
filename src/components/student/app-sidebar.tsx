"use client";

import Logo, { LogoMark } from "@/components/logo";
import {
  Atom,
  BotIcon,
  FlaskConical,
  Home,
  Leaf,
  Mail,
  Settings2,
  TestTube2
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/student/nav-main";
import { NavUser } from "@/components/student/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/session";
import { User } from "better-auth";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/student/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Simulations",
      url: "/student/simulations",
      icon: FlaskConical,
      items: [
        {
          title: "Physics",
          url: "/student/simulations/phy",
          icon: Atom,
        },
        {
          title: "Chemistry",
          url: "/student/simulations/chem",
          icon: TestTube2,
        },
        {
          title: "Biology",
          url: "/student/simulations/bio",
          icon: Leaf,
        },
      ],
    },
    {
      title: "AI ChatBot",
      url: "/student/chat",
      icon: BotIcon,
    },
    // {
    //   title: "Guide",
    //   url: "#",
    //   icon: BookOpen,
    // },
    // {
    //   title: "Assessment",
    //   url: "#",
    //   icon: ClipboardList,
    // },
    // {
    //   title: "Progress Report",
    //   url: "#",
    //   icon: BarChart4,
    // },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Contact Us",
      url: "#",
      icon: Mail,
    },
  ],
  projects: [], // Empty since we're not using projects in the new structure
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<User>({} as User);

  React.useEffect(() => {
    // Simulate fetching user session data
    const fetchSession = async () => {
      const sessionData = await getSession();
      if (sessionData) {
        setUserData(sessionData.user as User);
      }
    };
    fetchSession();
  }, []);

  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state === "collapsed" ? (
          <LogoMark className="h-9" />
        ) : (
          <Logo className="h-9" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* Removed NavProjects since we don't need it in the new structure */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}