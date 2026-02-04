"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { Attribute } from "@/lib/db/schema";
import { Button } from "@repo/ui/components/button";
import {
  PiArrowDownStroke,
  PiArrowUpStroke,
  PiDeleteDustbin02Stroke,
  PiListDefaultStroke,
  PiPencilEditStroke,
  PiSquareDotStroke,
  PiSwapHalfarrowVerticalStroke,
} from "@repo/ui/icons/pika";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteAttribute } from "@/lib/db/queries/attributes";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { dataTypes } from "@/lib/constants/datatypes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { removeAttributeFromLocalForm } from "@/app/collections/[collection]/attributes/(functions)/utils";
import { handleReturnInfo } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import DeleteDialogContent from "@repo/ui/blocks/dialogs/delete-dialog";
import { attributeDisplayOptionMap } from "@/lib/constants/display-options";
import type { AttributeDisplay } from "@/lib/constants/display-options";

export type ExtendedAttribute = Attribute & { collection_slug: string };

function SortButton({
  name,
  column,
}: {
  name: string;
  column: Column<ExtendedAttribute>;
}) {
  return (
    <Button
      variant={"ghost"}
      className="-ml-2 gap-1.5 px-2 text-left hover:bg-background md:hover:bg-background"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      {column.getIsSorted() === "asc" ? (
        <PiArrowUpStroke strokeWidth={2.5} className="size-3.5" />
      ) : column.getIsSorted() === "desc" ? (
        <PiArrowDownStroke strokeWidth={2.5} className="size-3.5" />
      ) : (
        <PiSwapHalfarrowVerticalStroke className="size-3.5" />
      )}
    </Button>
  );
}

export const columns: ColumnDef<ExtendedAttribute>[] = [
  {
    accessorKey: "slug",
    header: ({ column }) => {
      column.toggleVisibility(false);
    },
  },
  {
    accessorKey: "collection_slug",
    header: ({ column }) => {
      column.toggleVisibility(false);
    },
  },
  {
    accessorKey: "name",
    size: 200,
    header: ({ column }) => <SortButton name="Name" column={column} />,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="line-clamp-1 w-full text-ellipsis pl-2 font-bold text-base hover:underline"
              href={`/collections/${row.getValue(
                "collection_slug"
              )}/attributes/${row.getValue("slug")}`}
            >
              {name}
            </Link>
          </TooltipTrigger>
          <TooltipContent className="w-fit max-w-[30rem] p-2 text-sm">
            {name}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "type",
    size: 64,
    header: ({ column }) => <SortButton name="Type" column={column} />,
    cell: ({ row }) => {
      const typeKey = row.getValue("type") as string;
      const type = dataTypes[typeKey as keyof typeof dataTypes];
      if (!type) return null;
      return (
        <div className="flex w-fit items-center gap-1.5 text-muted-foreground">
          {type.icons.stroke({
            className: "size-4",
          })}
          {type.title}
        </div>
      );
    },
  },
  {
    accessorKey: "list",
    size: 50,
    header: ({ column }) => <SortButton name="List" column={column} />,
    cell: ({ row }) => {
      const list = row.getValue("list");
      return (
        <div className="flex w-fit items-center gap-1.5 text-muted-foreground">
          {list ? (
            <PiListDefaultStroke className="mr-0.5 size-4" />
          ) : (
            <PiSquareDotStroke className="size-4" />
          )}
          {list ? "List" : "Value"}
        </div>
      );
    },
  },
  {
    accessorKey: "display",
    size: 50,
    maxSize: 50,
    enableResizing: false,
    header: ({ column }) => <SortButton name="Display" column={column} />,
    cell: ({ row }) => {
      const displayValue = row.getValue("display") as AttributeDisplay;
      const display = attributeDisplayOptionMap[displayValue];
      if (!display) return null;
      return (
        <div className="flex w-fit items-center gap-1.5 text-muted-foreground">
          {display.Icon({ className: "size-4" })}
          {display.label}
        </div>
      );
    },
  },
  {
    id: "actions",
    size: 32,
    cell: ({ row }) => {
      const attribute = row.original;
      const router = useRouter();
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center gap-1.5"
                  href={`/collections/${attribute.collection_slug}/attributes/${attribute.slug}`}
                >
                  <PiPencilEditStroke className="size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex items-center gap-1.5">
                  <PiDeleteDustbin02Stroke className="size-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteDialogContent
            title="attribute"
            onDelete={async () => {
              const res = await deleteAttribute(attribute.id);
              handleReturnInfo(res, () => {
                removeAttributeFromLocalForm(
                  attribute.collection_slug,
                  attribute.slug
                );
                router.push(
                  `/collections/${attribute.collection_slug}/attributes`
                );
              });
            }}
          />
        </AlertDialog>
      );
    },
  },
];
