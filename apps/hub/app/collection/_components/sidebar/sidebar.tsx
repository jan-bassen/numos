'use client'

import type * as React from 'react'

import { SidebarCategories } from '@/app/collection/_components/sidebar/categories'
import { NavProjects } from '@/app/collection/_components/sidebar/nav-projects'
import { Socials } from '@/app/collection/_components/sidebar/socials'
import { UserButton } from '@/app/collection/_components/sidebar/user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/ui/components/sidebar'
import {
  PiHeartSupportStroke,
  PiPhotoImageCheckStroke,
  PiSendPlaneSlantStroke,
  PiSettings02Stroke,
  PiTerminalConsoleCircleStroke,
  PiNftProfileUserStroke,
  PiFrameStroke,
  PiDiscordStroke,
  PiXComStroke,
  PiPaintBrushStroke,
  PiCameraStroke,
  PiGamingPadStroke,
  PiTvStroke,
  PiPhotoImageDefaultStroke,
  PiNftProfileUserDuoSolid,
  PiNftProfileUserSolid,
  PiPhotoImageDefaultSolid,
  PiTvSolid,
  PiPlayBigStroke,
  PiPlayBigSolid,
  PiGamingPadSolid,
  PiPlaySmallSolid,
  PiPlaySquareSolid,
  PiPlaySquareDuoSolid,
  PiPlaySquareStroke,
  PiDiscordSolid,
  PiXComSolid,
  PiHomeDefaultStroke,
  PiHomeDefaultSolid,
  PiStarStroke,
  PiStarSolid,
  PiGrid01Stroke,
  PiGrid01Solid,
  PiGrid02Stroke,
  PiGridDashboard01Stroke,
  PiGridDashboard02Stroke,
  PiGridDashboard02Solid,
} from '@repo/ui/icons/pika'
import {
  Amphora,
  Award,
  BookText,
  CalendarHeart,
  Camera,
  CassetteTape,
  CircuitBoard,
  ContactRound,
  Dog,
  Film,
  ImageIcon,
  ImagePlay,
  LibraryBig,
  ShieldUser,
  Signature,
  Sword,
  Tag,
  Trophy,
  UserPen,
  Disc3,
  Receipt,
  ScrollText,
  BookOpen,
  IdCard,
  LandPlot,
  Sticker,
  Shirt,
} from '@repo/ui/icons/lucide'
import { Command } from '@repo/ui/components/command'
import { HeaderContent } from './header'
import { Main } from './main'
import { cn } from '@repo/ui/lib/utils'

/* 
- Materials (?)
- Pure Utility (?)
- Pure Collectibles (?)
 */

const data = {
  navMain: [
    {
      title: 'Home',
      url: '#',
      icons: {
        stroke: PiHomeDefaultStroke,
        fill: PiHomeDefaultSolid,
      },
    },
    {
      title: 'Collection',
      url: '#',
      icons: {
        stroke: PiGridDashboard02Stroke,
        fill: PiGridDashboard02Solid,
      },
    },
  ],
  categories: [
    {
      title: 'Identity',
      url: '#',
      icons: {
        stroke: PiNftProfileUserStroke,
        fill: PiNftProfileUserSolid,
      },
      isActive: true,
      items: [
        {
          title: 'Avatars',
          slug: 'avatars',
          icon: ContactRound,
          isActive: true,
        },
        {
          title: 'Names',
          slug: 'names',
          icon: Signature,
        },
        {
          title: 'Fashion',
          slug: 'fashion',
          icon: Shirt,
        },
        {
          title: 'Companions',
          slug: 'companions',
          icon: Dog,
        },
        {
          title: 'Memberships',
          slug: 'memberships',
          icon: IdCard,
        },
        {
          title: 'Memories',
          slug: 'memories',
          icon: CalendarHeart,
        },
        {
          title: 'Attestations',
          slug: 'attestations',
          icon: ScrollText,
        },
      ],
    },
    {
      title: 'Art',
      url: '#',
      icons: {
        stroke: PiPhotoImageDefaultStroke,
        fill: PiPhotoImageDefaultSolid,
      },
      items: [
        {
          title: 'Generative',
          slug: 'generative',
          icon: CircuitBoard,
        },
        {
          title: 'Paintings',
          slug: 'paintings',
          icon: ImageIcon,
        },
        {
          title: 'Animations',
          slug: 'animations',
          icon: ImagePlay,
        },
        {
          title: 'Memes',
          slug: 'memes',
          icon: Sticker,
        },
        {
          title: 'Photography',
          slug: 'photography',
          icon: Camera,
        },
        {
          title: 'Sculptures',
          slug: 'sculptures',
          icon: Amphora,
        },
      ],
    },
    {
      title: 'Media',
      url: '#',
      icons: {
        stroke: PiPlaySquareStroke,
        fill: PiPlaySquareSolid,
      },
      items: [
        {
          title: 'Books',
          slug: 'books',
          icon: LibraryBig,
        },
        {
          title: 'Movies',
          slug: 'movies',
          icon: Film,
        },
        {
          title: 'Music',
          slug: 'music',
          icon: Disc3,
        },
      ],
    },
    {
      title: 'Gaming',
      url: '#',
      icons: {
        stroke: PiGamingPadStroke,
        fill: PiGamingPadSolid,
      },
      items: [
        {
          title: 'Lands',
          slug: 'lands',
          icon: LandPlot,
        },
        {
          title: 'Characters',
          slug: 'characters',
          icon: ShieldUser,
        },
        {
          title: 'Inventory',
          slug: 'inventory',
          icon: Sword,
        },
        {
          title: 'Cosmetics',
          slug: 'cosmetics',
          icon: UserPen,
        },
        {
          title: 'Achievements',
          slug: 'achievements',
          icon: Award,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Discord',
      url: '#',
      icon: PiDiscordSolid,
    },
    {
      title: 'Twitter',
      url: '#',
      icon: PiXComStroke,
    },
  ],
}

export function CollectionSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className="scrollbar-none">
        <Main items={data.navMain} />
        {/* <SidebarCategories items={data.categories} /> */}
        {/* <NavProjects projects={data.projects} /> */}
        <Socials items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
