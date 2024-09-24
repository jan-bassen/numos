import EmojiPicker, {
  Categories,
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react'

export default function EmojiPickerComponent(props: {
  handler: (arg0: EmojiClickData, arg1: MouseEvent) => void
}) {
  const { handler } = props
  return (
    <EmojiPicker
      onEmojiClick={(emojiData: EmojiClickData, event: MouseEvent) =>
        handler(emojiData, event)
      }
      theme={Theme.AUTO}
      lazyLoadEmojis={true}
      categories={[
        { category: Categories.SMILEYS_PEOPLE, name: 'Faces...' },
        { category: Categories.ANIMALS_NATURE, name: 'Animals...' },
        { category: Categories.FOOD_DRINK, name: 'Food...' },
        { category: Categories.TRAVEL_PLACES, name: 'Travel...' },
        { category: Categories.ACTIVITIES, name: 'Activities...' },
        { category: Categories.OBJECTS, name: 'Objects...' },
        { category: Categories.SYMBOLS, name: 'Symbols...' },
      ]}
      previewConfig={{ showPreview: false }}
      width="full"
      height={325}
    />
  )
}
