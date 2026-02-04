"use server";

import { getActionGraph } from "@/lib/db/queries/action-graph";
import { getAllActions } from "@/lib/db/queries/actions";
import { insertActionIssues } from "@/lib/db/queries/action-issues";
import { validateAction } from "./validate-action";
import { handleReturnInfo } from "@repo/ui/lib/utils";

export async function updateIssues(version: string) {
  // actions into own file and function later
  const actions = await getAllActions(version);
  const action = actions[0];
  if (!action) return;
  const graph = await getActionGraph(action.id);

  const res = validateAction(action, graph);
  if (res.length !== 0) {
    const res2 = await insertActionIssues(
      res.map((issue) => ({
        action: action.id,
        data: issue,
      }))
    );
    handleReturnInfo(res2);
  }

  console.log(res);

  // attributes into own file and function later
  // collection + version into own file and function later
}
