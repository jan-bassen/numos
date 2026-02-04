"use client";

import Link from "next/link";
import { handleReturnInfo } from "@repo/ui/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import {
  PiDeleteDustbin02Stroke,
  PiPencilEditBoxStroke,
} from "@repo/ui/icons/pika";
import { deleteAttributeBySlug } from "@/lib/db/queries/attributes";
import DeleteDialogContent from "@repo/ui/blocks/dialogs/delete-dialog";
import { removeAttributeFromLocalForm } from "@/app/collections/[collection]/attributes/(functions)/utils";
import type { ComponentProps } from "react";

interface AttributeContextMenuProps {
  children?: React.ReactNode;
  attributeSlug: string;
  collectionSlug: string;
  versionId: string;
}

export default function AttributeContextMenu({
  onOpenChange,
  children,
  attributeSlug,
  collectionSlug,
  versionId,
  ...props
}: AttributeContextMenuProps & ComponentProps<typeof ContextMenu>) {
  const href = `/collections/${collectionSlug}/attributes/${attributeSlug}`;
  return (
    <AlertDialog>
      <ContextMenu {...props}>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="min-w-40">
          <ContextMenuItem asChild>
            <Link href={href} className="flex gap-1.5">
              <PiPencilEditBoxStroke className="h-4 w-4" />
              Edit
            </Link>
          </ContextMenuItem>
          <AlertDialogTrigger asChild>
            <ContextMenuItem>
              <PiDeleteDustbin02Stroke className="mr-1.5 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </AlertDialogTrigger>
        </ContextMenuContent>
      </ContextMenu>
      <DeleteDialogContent
        title="attribute"
        onDelete={async () => {
          const res = await deleteAttributeBySlug(versionId, attributeSlug);
          handleReturnInfo(res, () => {
            removeAttributeFromLocalForm(collectionSlug, attributeSlug);
          });
        }}
      />
    </AlertDialog>
  );
}
