import type { AnyControlDefinition } from '@/types/nodes.types'
import type { Node } from './node'
import { debounce } from 'lodash'
import { ZodError, type ZodIssue } from 'zod'
import type {
  RawValue,
  Value,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'
import { getDataTypeSchema } from '@repo/engine/datatypes/schemas'
import { resolveObjectArrayValue } from '@repo/engine/datatypes/utils'

export class Control {
  id: string
  value: Value<ValueType, 'single' | 'objectarray', true>
  valid = true
  issues: ZodIssue[] = []
  settings?: ValueSettings
  index?: number
  constructor(
    public node: Node,
    public definition: AnyControlDefinition,
    value?: Value<ValueType, 'single' | 'objectarray', true>,
  ) {
    this.id = crypto.randomUUID()
    this.value =
      value ||
      ({
        type: definition.type,
        format: definition.list ? 'objectarray' : 'single',
        value: undefined,
      } as Value<ValueType, 'single' | 'objectarray', true>)
    this.settings = definition.settings
    this.index = definition.index
    this.validate()
    this.saveNode = this.saveNode.bind(this)
  }

  onChange(value: Value<ValueType, 'single' | 'objectarray', true>) {
    this.definition?.onChange?.(this.node.interactionInterface, value)
  }

  getValue(): Value<ValueType, 'single' | 'objectarray', true> {
    return this.value
  }

  getResolvedValue(): Value<ValueType, 'single' | 'array', true> {
    const resolvedValue = resolveObjectArrayValue(this.value)
    return resolvedValue
  }

  setRawValue(value: RawValue<'objectarray' | 'single'>) {
    const newValue = {
      type: this.value.type,
      list: this.value.format,
      value,
    } as unknown as Value<ValueType, 'single' | 'objectarray', true>
    this.setValue(newValue)
  }

  setValue(value: Value<ValueType, 'single' | 'objectarray', true>) {
    this.value = value
    this.onChange?.(value)
    this.validate()
    this.node.context.area.update('control', this.id)
    /* debounce(this.validate, 1500)() */
    debounce(this.saveNode, 1500)()
  }

  saveNode() {
    const editor = this.node.context.editor
    editor.events.onNodeChanged?.(editor, this.node.save())
  }

  // TODO: Validate more
  /*   serialize(): SavedControl {
    const resolvedValue = resolveObjectArrayValue<ValueType, true>(this.value)
    return {
      key: this.id,
      ...resolvedValue,
    }
  } */

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
    const schema = getDataTypeSchema(this.value.type, this.value.format, true)
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
  }
}
