import type { Connection } from '../../connection'
import type { NodeEditor } from '../../editor'
import type { Action } from '../plugin'

export class AddConnectionAction implements Action {
  constructor(
    private editor: NodeEditor,
    private connection: Connection,
  ) {}

  async undo() {
    await this.editor.removeConnection(this.connection.id)
  }

  async redo() {
    await this.editor.addConnection(this.connection)
  }
}

export class RemoveConnectionAction implements Action {
  constructor(
    private editor: NodeEditor,
    private connection: Connection,
  ) {}

  async undo() {
    await this.editor.addConnection(this.connection)
  }

  async redo() {
    await this.editor.removeConnection(this.connection.id)
  }
}
