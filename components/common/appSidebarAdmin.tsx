"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BadgeCent,
  BikeIcon,
  Boxes,
  CameraIcon,
  Cog,
  FileCodeIcon,
  FileTextIcon,
  ImageIcon,
  Layers3,
  LayoutDashboardIcon,
  UserCircle2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./navMain";
// import { NavUser } from './navUser';

export function AppSidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const navigationData = {
    navMain: [
      {
        title: "Tổng quan",
        url: "/admin/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Quản lý Loại xe",
        url: "/admin/vehicles",
        icon: Layers3,
      },
      {
        title: "Quản lý Thương hiệu",
        url: "/admin/brands",
        icon: BadgeCent,
      },
      {
        title: "Quản lý Mẫu xe",
        url: "/admin/models",
        icon: BikeIcon,
      },
      {
        title: "Quản lý Màu & Hình ảnh",
        url: "/admin/variants",
        icon: ImageIcon,
      },
      {
        title: "Quản lý Phụ tùng",
        url: "/admin/parts",
        icon: Cog,
      },
      {
        title: "Sản Phẩm Phụ Tùng",
        url: "/admin/products",
        icon: Boxes,
      },
      {
        title: "Quản lý Xe người dùng",
        url: "/admin/users-vehicles",
        icon: UserCircle2,
      },
      {
        title: "Quản lý Người dùng",
        url: "/admin/users",
        icon: Users,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: CameraIcon,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: FileTextIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: FileCodeIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    // navSecondary: [
    //   {
    //     title: t('appSidebar.settings'),
    //     url: '#',
    //     icon: SettingsIcon,
    //   },
    //   {
    //     title: t('appSidebar.getHelp'),
    //     url: '#',
    //     icon: HelpCircleIcon,
    //   },
    //   {
    //     title: t('appSidebar.search'),
    //     url: '#',
    //     icon: SearchIcon,
    //   },
    // ],
    // documents: [
    //   {
    //     name: 'Data Library',
    //     url: '#',
    //     icon: DatabaseIcon,
    //   },
    //   {
    //     name: 'Reports',
    //     url: '#',
    //     icon: ClipboardListIcon,
    //   },
    //   {
    //     name: 'Word Assistant',
    //     url: '#',
    //     icon: FileIcon,
    //   },
    // ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Verendar Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {/* <NavDocuments items={navigationData.documents} /> */}
        {/* <NavSecondary items={navigationData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
}
