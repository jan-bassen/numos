import { createRoot } from 'react-dom/client'
import { AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin } from 'rete-connection-plugin'
import type {
  EditorContext,
  Schemes,
  AreaExtra,
  Editor,
  EditorEvents,
  EditorSettings,
  EditorConfig,
} from '@/types/editor.types'
import type { Control } from './classes/control'
import { getConnectionPreset } from './utils/presets'
import { getSocket, SocketProps } from '@/components/node-editor/node/socket'
import { getConnection } from '@/components/node-editor/connection'
import type {
  ExtractPayload,
  ReactArea2D,
} from 'rete-react-plugin/_types/presets/classic/types'
import { NodeComponent } from '@/components/node-editor/node/node'
import { Node } from './classes/node'
import _ from 'lodash'
import { NodeEditor } from './classes/editor'
import { insertableNodes } from './utils/insertable-nodes'
import { toast } from 'sonner'
import { ControlComponent } from '@/components/node-editor/node/base-control'
import { getPseudoConnectionType } from './classes/connection'
import { AreaPlugin } from './classes/area/area-plugin'
import { zoomAt } from './classes/area/extensions/zoom-at'
import { HistoryPlugin } from './classes/history/plugin'
import {
  type HistoryActions,
  loadHistoryActions,
} from './classes/history/load-actions'
import type { SavedGraph } from '@repo/engine/types/graph-types'
import { Presets, ReactPlugin } from 'rete-react-plugin'

export async function createEditor(
  container: HTMLElement,
  config: EditorConfig,
  context: EditorContext,
  settings: EditorSettings,
  events: EditorEvents,
  graph?: SavedGraph,
): Promise<Editor> {
  const area = new AreaPlugin(container)
  const editor = new NodeEditor(config, context, events, settings, area)

  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()

  /*   const arrange = new AutoArrangePlugin<Schemes>();
    arrange.addPreset(ArrangePresets.classic.setup());
    area.use(arrange); */

  const history = new HistoryPlugin<Schemes, HistoryActions>({
    timing: 500,
  })
  history.addPreset(loadHistoryActions())

  editor.addPipe((context) => {
    if (!context || typeof context !== 'object' || !('type' in context))
      return context
    if (context.type === 'noderemoved') {
      const recentHistory = history.getHistorySnapshot()
    }
    return context
  })

  //remove connections on alt + drag
  //TODO: Finish
  /*   area.addPipe((context) => {
    if (!context || typeof context !== 'object' || !('type' in context))
      return context
    if (context.type === 'nodecreated') {
      const view = area.nodeViews.get(context.data.id)
      if (!view) return context
      view.dragHandler = new Drag({
        down: (e) => !(e.pointerType === 'mouse' && e.button !== 0),
        move: (e) => {
          if (e.altKey) {
            console.log('Alt pressed')
          }
          return true
        },
      })
      view.dragHandler.initialize(
        view.element,
        {
          getCurrentPosition: () => view.position,
          getZoom: () => 1,
        },
        {
          start: () => null,
          translate: () => null,
          drag: () => null,
        },
      )
    }
    return context
  }) */

  connection.addPreset(getConnectionPreset(editor, connection))
  /* 
  const selector = new Selector(
    editor,
    area,
    accumulateOnShift(),
    events.onSelectionChanged,
  );

  const multiSelector = addMultiSelector(area, {
    selected(ids) {
      const oldIds = selector.selectedNodes;
      if (_.isEqual(ids, oldIds)) return;
      const [first, ...rest] = ids;
      selector.unselectAllNodes();
      if (first) {
        selector.selectNode(first, false);
      }
      for (const id of rest) {
        selector.selectNode(id, true);
      }
      selector.onSelectionChange &&
        selector.onSelectionChange(selector.selectedNodes);
    },
  });

  multiSelector.setButton(0);
  multiSelector.setShape("marquee");
  multiSelector.setMode("rect"); */

  area.use(connection)
  area.use(render)
  area.use(history)

  AreaExtensions.simpleNodesOrder(area)
  insertableNodes(editor, area)

  render.addPreset(
    Presets.classic.setup<Schemes, ReactArea2D<Schemes>>({
      customize: {
        //TODO: Fix these types somehow
        // @ts-ignore
        node(data: ExtractPayload<Schemes, 'node'>) {
          return NodeComponent
        },
        // @ts-ignore
        socket(data: ExtractPayload<Schemes, 'socket'>) {
          return getSocket(data)
        },
        // @ts-ignore
        connection(data: ExtractPayload<Schemes, 'connection'>) {
          const type = data.payload.type
            ? data.payload.type
            : getPseudoConnectionType(data.payload, editor)
          return getConnection(type)
        },
        // @ts-ignore
        control(
          data: {
            element: HTMLElement
            filled?: boolean | undefined
            type: 'control'
          } & { payload: Control },
        ) {
          const control = data.payload
          if (!control.value.type) throw new Error('No type')
          return ControlComponent
        },
      },
    }),
  )

  //Limit zoom and remove zoom on double click
  area.addPipe((context) => {
    if (context.type === 'zoom') {
      if (context.data.source === 'dblclick') {
        return
      }
      if (context.data.zoom < 0.2) {
        context.data.zoom = 0.2
      }
      if (context.data.zoom > 5) {
        context.data.zoom = 5
      }
    }
    return context
  })

  //Node position saving happens in selector
  //Handle editor events
  editor.addPipe((context) => {
    if (!editor.setupComplete) {
      return context
    }
    if (context.type === 'nodecreated') {
      editor.events.onNodeCreated?.(editor, context.data.save())
    }
    if (context.type === 'noderemoved') {
      editor.events.onNodeRemoved?.(editor, context.data)
    }
    if (context.type === 'connectioncreated') {
      editor.events.onConnectionCreated?.(editor, context.data.serialize())
    }
    if (context.type === 'connectionremoved') {
      editor.events.onConnectionRemoved?.(editor, context.data)
    }
    return context
  })

  //Handle zoom
  area.addPipe((context) => {
    if (context.type === 'zoomed') {
      events.onZoomed?.(editor, context.data)
    }
    return context
  })

  //Handle socket events
  editor.addPipe((context) => {
    if (context.type === 'connectioncreated') {
      const { source, target, targetInput, sourceOutput } =
        context.data.resolveConnectionData()
      sourceOutput?.socket.onConnect?.(source, context.data)
      targetInput?.socket.onConnect?.(target, context.data)
    }
    if (context.type === 'connectionremoved') {
      const { source, target, targetInput, sourceOutput } =
        context.data.resolveConnectionData()
      sourceOutput?.socket.onDisconnect?.(source, context.data)
      targetInput?.socket.onDisconnect?.(target, context.data)
    }
    return context
  })

  //Disallow multiple root nodes
  editor.addPipe((context) => {
    if (context.type === 'nodecreate' && context.data.definition.root) {
      const existingRoot = editor
        .getNodes()
        .find((node) => node.definition.root)
      if (existingRoot) {
        toast.error('Only one root node is allowed!')
        return
      }
    }
    return context
  })

  //Disallow multiple connections to the exec outputs
  editor.addPipe((context) => {
    if (context.type === 'connectioncreate') {
      const { source, sourceOutput, type } = context.data

      if (sourceOutput && type === 'exec') {
        const connections = editor
          .getConnections()
          .filter((c) => c.source === source && c.sourceOutput === sourceOutput)
        if (connections.length > 0) {
          for (const connection of connections) {
            editor.removeConnection(connection.id)
          }
          toast.warning('Execution can&apos;t be split into two!')
          return context
        }
      }
    }
    return context
  })

  /*   connection.addPipe((context) => {
    if (context.type === "connectionpick") {
      const socket = context.data.socket as SocketData & { payload: Socket };
      console.log(socket);
      if (socket.payload.type === "exec" && socket.side === "output") {
        const connections = editor
          .getConnections()
          .filter(
            (c) => c.source === socket.nodeId && c.sourceOutput === socket.key,
          );
        if (connections.length > 0) {
          return;
        }
      }
    }
    return context;
  }); */

  //Load graph
  if (graph && graph.nodes.length > 0) {
    await editor.importGraph(graph, area, history, true)
  } else {
    editor.setupComplete = true
    const rootConfig = editor.config.nodes[editor.config.root.type]
    if (!rootConfig) throw new Error('Root config not found')
    const rootNode = new Node(
      rootConfig,
      {
        area: area,
        editor: editor,
      },
      undefined,
      editor.config.root.position,
    )
    await editor.addNode(rootNode)
    zoomAt(area, [rootNode])
  }

  return {
    destroy: () => area.destroy(),
    area: area,
    editor: editor,
    history: history,
    /* selector: selector, */
  }
}
