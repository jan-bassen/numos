import { ClassicPreset } from 'rete'
import type {
  ControlDefinition,
  SavedControl,
  SelectOptions,
} from '@/types/nodes.types'
import type { Node } from './node'
import { debounce } from 'lodash'
import type {
  DataTypeValue,
  NotatedDataTypeValue,
  ValueDataType,
} from '@/types/database.types'
import { getDataTypeSchema } from '@/components/datatypes/schemas'
import { ZodError, type ZodIssue } from 'zod'
import { index } from 'drizzle-orm/mysql-core'

export class Control extends ClassicPreset.Control {
  node: Node
  value: NotatedDataTypeValue<true, true>
  valid = true
  issues: ZodIssue[] = []
  definition?: ControlDefinition
  options?: SelectOptions
  index?: number
  constructor(
    node: Node,
    definition: ControlDefinition,
    savedControl?: SavedControl,
  ) {
    super()
    this.node = node
    this.id = savedControl?.key || this.id

    this.value = {
      type: definition.type,
      list: definition.list || false,
      value: savedControl?.value,
    } as NotatedDataTypeValue<true, true>

    this.definition = definition
    if ('options' in definition) this.options = definition.options
    this.index = definition.index
    this.validate()
    this.saveNode = this.saveNode.bind(this)
  }

  onChange(value: NotatedDataTypeValue<true, true>) {
    this.definition?.onChange?.(this.node, value)
  }

  setValue(value: DataTypeValue<true>) {
    const newValue = {
      type: this.value.type,
      list: this.value.list || false,
      value,
    } as NotatedDataTypeValue<true, true>
    this.setNotatedValue(newValue)
  }

  setNotatedValue(value: NotatedDataTypeValue<true, true>) {
    this.value = value
    this.onChange?.(value)
    this.validate()
    this.node.context.area.update('control', this.id)
    /* debounce(this.validate, 1500)() */
    debounce(this.saveNode, 1500)()
  }

  saveNode() {
    const editor = this.node.context.editor
    editor.events.onNodeChanged?.(editor, this.node.serialize())
  }

  // TODO: Validate more
  serialize(): SavedControl {
    return {
      key: this.id,
      ...this.value,
    }
  }

  setIssues(issues: ZodIssue[]) {
    this.issues = issues
    this.valid = false
    this.node.context.area.update('node', this.node.id)
  }

  getIssues() {
    return this.issues
  }

  clearIssues() {
    this.valid = true
    this.issues = []
    this.node.context.area.update('node', this.node.id)
  }

  validate() {
    if (!this.value.type) return
    const schema = getDataTypeSchema(this.value.type, this.value.list, {
      optional: true,
      asObjectArray: true,
    })
    try {
      schema.parse(this.value.value)
    } catch (error) {
      if (error instanceof ZodError) {
        if (error.issues.length === 0) {
          this.clearIssues()
          return
        }
        this.setIssues(error.issues)
        return
      }
    }
    this.clearIssues()

    /*     
    this.valid = isValidValueType<true, true>(
      this.value.type,
      this.value.list,
      this.value.value,
      { optional: true, asObjectArray: true },
    )
    this.node.context.area.update('node', this.node.id)
    */
  }
}
