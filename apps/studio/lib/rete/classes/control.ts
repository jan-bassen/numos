import type { AnyControlDefinition } from '@/types/nodes.types'
import type { Node } from './node'
import { debounce } from 'lodash'
import { ZodError, type ZodIssue } from 'zod'
import type { RawValue, Value, ValueType } from '@repo/shared/types/values'
import { getDataTypeSchema } from '@repo/shared/schemas/datatypes/get-datatype-schema'
import { resolveObjectArrayValue } from '@repo/shared/schemas/datatypes/utils'
import type { ValueRestrictions } from '@repo/shared/types/values'

export class Control {
  id: string
  value: Value<ValueType, 'single' | 'objectarray', true>
  valid = true
  issues: ZodIssue[] = []
  restrictions?: ValueRestrictions
  index?: number
  constructor(
    public node: Node,
    public definition: AnyControlDefinition,
    value?: Value<ValueType, 'single' | 'objectarray', true>,
  ) {
    this.id = crypto.randomUUID()
    this.value =
      value ||
      definition.default ||
      ({
        type: definition.type,
        format: definition.list ? 'objectarray' : 'single',
        value: undefined,
      } as Value<ValueType, 'single' | 'objectarray', true>)
    this.restrictions = definition.restrictions
    this.index = definition.index
    this.validate()
    this.saveNode = this.saveNode.bind(this)
  }

  //TODO: Clean up duplicate code
  saveNode = debounce(() => {
    const editor = this.node.context.editor
    editor.events.onNodeChanged?.(editor, this.node.save())
  }, 1500)

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

  setRawValue(value: RawValue<ValueType, 'objectarray' | 'single'>) {
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
    this.saveNode()
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
    const schema = getDataTypeSchema(this.value.type, this.value.format, true)
    try {
      schema.parse(this.value)
    } catch (error) {
      /*  console.log('control')
      console.log(this.definition.key)
      console.log(this.definition.type)
      console.log(this.value)
      console.error(error) */
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
