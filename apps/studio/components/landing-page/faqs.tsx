import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion'

const questions = [
  {
    question: 'What exactly do you offer?',
    answer:
      'We at Numos Labs want to provide you with powerful, yet simple tools to create the best and most engaging digital assets (NFTs) and experiences. Numos is a full-service platform designed for crafting, launching, and managing dynamic & interactive digital assets. This includes reliable infrastructure to publish, run and continuously update your digital assets.',
  },
  {
    question: 'When can I use the platform?',
    answer:
      'We are working hard on making the platform deployment ready. We are aiming to give the first users access in Q2 2024. Make sure to join our beta program to be among the first!',
  },
  {
    question: 'What is a dynamic asset?',
    answer:
      'Dynamic assets can change. This could mean anything from modifications in metadata to alterations in its in-game abilities, prompts for an AI-driven model, or the appearance of generative artwork. Essentially, any characteristic can be adjusted to influence how your asset looks and behaves.',
  },
  {
    question: 'Why should I consider launching a dynamic asset?',
    answer:
      'Dynamic assets, or NFTs, have been shown to significantly boost engagement rates. They foster a stronger emotional connection and bond between the user and the asset. Additionally, users often perceive a higher value in dynamic or interactive models, enhancing their overall appeal and effectiveness.',
  },
  {
    question: 'How much will this cost?',
    answer:
      "We tailor our rates based on your specific needs, including your project requirements, use cases, and the features you select. Whether you're a solo artist, a startup, a deep-NFT/Web3 company, or developing the next hit game, we've got you covered. Early adopters, always get a special treatment 🤫 so don't hesitate to reach out.",
  },
]

export default function Faqs() {
  return (
    <div className="grid place-items-center">
      <Accordion type="single" collapsible className="w-full md:w-[40rem]">
        {questions.map((q, i) => (
          <AccordionItem value={`item-${i}`} key={q.question.slice(0, 20)}>
            <AccordionTrigger className="font-bold text-left md:text-center">
              {q.question}
            </AccordionTrigger>
            <AccordionContent>{q.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
