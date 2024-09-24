import type {
  NodeDefinitions,
  ControlDefinition,
  SocketDefinition,
  SelectOptions,
} from '@/types/nodes.types'
import _, { update } from 'lodash'
import {
  type EnumSettings,
  type SocketType,
  ValueSettings,
} from '@/types/database.types'
import type { ActionTrigger } from '@/components/elements/actions/action-schema'
import { Control } from '../../classes/control'
import { listNodes } from './list-nodes'
import { th } from 'date-fns/locale'

export type ActionNodeType =
  | 'action-root'
  | 'change-attribute'
  | 'change-token-name'
  | 'change-token-description'
  | 'switch'
  | 'log'
  | 'stop'
  | 'cancel'

export const actionNodes: NodeDefinitions<ActionNodeType> = {
  'action-root': {
    type: 'action-root',
    title: 'Trigger',
    root: true,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node starts the execution.',
      link: '#',
    },
    outputs: (node) => {
      const execDef: SocketDefinition = {
        key: 'exec',
        type: 'exec',
        label: 'Execute',
      }
      const outputs = [execDef]
      const trigger = node.context.editor.context.action
        ?.trigger as ActionTrigger
      if (!trigger) return []
      if (trigger.type === 'token') {
        outputs.push({
          key: 'tokenId',
          type: 'number',
          label: 'Token ID',
        })
        if (trigger.settings.event === 'mint') {
          outputs.push({
            key: 'minter',
            type: 'address',
            label: 'Minter',
          })
        } else if (trigger.settings.event === 'burn') {
          outputs.push(
            {
              key: 'old',
              type: 'address',
              label: 'Previous Owner',
            },
            {
              key: 'new',
              type: 'address',
              label: 'New Owner',
            },
          )
        } else if (trigger.settings.event === 'approve') {
          outputs.push({
            key: 'approved',
            type: 'address',
            label: 'Approved Address',
          })
        }
      }
      if (trigger.type === 'api') {
        outputs.push(
          ...trigger.settings.params.map((param) => {
            return {
              key: param.key,
              type: param.type,
              list: param.list,
              label: param.key,
            }
          }),
        )
      }
      return outputs
    },
  },
  'change-attribute': {
    type: 'change-attribute',
    title: 'Change Attribute',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'With this node you can change one of the tokens attributes.',
      link: '#',
    },
    controls: (node, savedControls) => {
      const attributes = node.context.editor.context.attributes
      const controls: ControlDefinition[] = [
        {
          key: 'attribute',
          type: 'enum',
          label: 'Attribute',
          placeholder: 'Select Attribute',
          options: attributes.map((attr) => {
            return {
              value: attr.slug,
              label: attr.name || 'Unnamed Attribute',
            }
          }),
          onChange: () => {
            node.updateInputs()
            node.updateControls()
          },
        },
      ]
      const attributeControlValue = node.controls.attribute?.value
      if (attributeControlValue || savedControls?.attribute?.value) {
        const slug =
          attributeControlValue?.value ||
          (savedControls?.attribute?.value as string)
        const attributeType = attributes.find((attr) => attr.slug === slug)
          ?.type as SocketType
        if (!attributeType) return controls
        if (attributeType === 'number') {
          controls.push({
            key: 'mode',
            type: 'enum',
            label: 'Mode',
            placeholder: 'Select Mode',
            defaultValue: 'set',
            options: [
              { value: 'set', label: 'Set to' },
              { value: 'incr', label: 'Increase by' },
              { value: 'decr', label: 'Decrease by' },
            ],
          })
        }
      }
      return controls
    },
    inputs: (node) => {
      const attributeControl = node.controls.attribute
      if (!attributeControl) throw new Error('No attribute control')
      const attributes = node.context.editor.context.attributes
      const attribute = attributes.find(
        (attr) => attr.slug === attributeControl.value.value,
      )
      if (
        !attributeControl.value ||
        !attributes ||
        !attribute ||
        !attribute?.type
      )
        return [
          {
            key: 'exec',
            type: 'exec',
            label: 'Execute',
          },
        ]
      let options: SelectOptions | undefined
      let control: ControlDefinition | undefined
      if (attribute.type === 'enum') {
        const settings = attribute.settings as EnumSettings | undefined
        options = settings?.options
        control = {
          key: 'value',
          type: attribute?.type,
          options,
        }
      }

      return [
        {
          key: 'exec',
          type: 'exec',
          label: 'Execute',
        },
        {
          key: 'value',
          type: attribute?.type,
          list: attribute?.list,
          label: 'Value',
          control,
          options,
        },
      ]
    },
    outputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
  'change-token-name': {
    type: 'change-token-name',
    title: 'Change Token Name',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'With this node you can change the metadata of the token.',
      link: '#',
    },
    inputs: [
      { key: 'exec', type: 'exec', label: 'Execute' },
      { key: 'name', type: 'string', label: 'Name' },
    ],
    outputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
  'change-token-description': {
    type: 'change-token-description',
    title: 'Change Token Description',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'With this node you can change the description of the token.',
      link: '#',
    },
    inputs: [
      { key: 'exec', type: 'exec', label: 'Execute' },
      { key: 'description', type: 'string', label: 'Description' },
    ],
    outputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
  switch: {
    type: 'switch',
    title: 'Switch',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This can switch between two execution paths.',
      link: '#',
    },
    inputs: [
      { key: 'exec', type: 'exec', label: 'Execute' },
      { key: 'switch', type: 'boolean', label: 'Switch' },
    ],
    outputs: [
      { key: 'true', type: 'exec', label: 'If true' },
      { key: 'false', type: 'exec', label: 'If false' },
    ],
  },
  log: {
    type: 'log',
    title: 'Log',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node logs some text for testing. You can use this to debug your actions.',
      link: '#',
    },
    inputs: ({ inputs, updateInputs }) => {
      const sourceOutput = inputs.value?.socket.connection?.getSourceOutput()
      if (!sourceOutput) throw new Error('No source output')
      const sourceSocket = sourceOutput.socket
      const def = sourceSocket?.definition
      const inputType = sourceSocket?.type || 'generic'
      const list = sourceSocket?.list || false
      const options = def && 'options' in def ? def.options : undefined
      return [
        { index: 0, key: 'exec', type: 'exec', label: 'Execute' },
        {
          index: 1,
          key: 'value',
          type: inputType,
          canBeList: true,
          options,
          list,
          label: 'Value',
          hideControl: true,
          onConnect: () => updateInputs(),
          onDisconnect: () => updateInputs(),
        },
      ]
    },
    outputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
  stop: {
    type: 'stop',
    title: 'Stop',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node stops the execution of the action imperatively without (!) reverting any changes.',
      link: '#',
    },
    inputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
  cancel: {
    type: 'cancel',
    title: 'Cancel',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        "This node cancels the execution of the action and reverts any changes to it's initial state.",
      link: '#',
    },
    inputs: [{ key: 'exec', type: 'exec', label: 'Execute' }],
  },
}
