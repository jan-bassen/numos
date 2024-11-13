'use server'
import { generateObject, JSONParseError, TypeValidationError } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import cron from 'cron-validate'

const schema = z.object({
  schedule: z
    .string()
    .describe('Schedule in the AWS cron format')
    .optional()
    .refine(
      (schedule) => {
        if (!schedule) return true
        const cronResult = cron(schedule, { preset: 'aws-cloud-watch' })
        if (cronResult.isValid()) {
          return true
        }
        return false
      },
      {
        message: "Schedule doesn't match cron format",
      },
    ),
  description: z
    .string()
    .optional()
    .describe('Brief description of the schedule'),
  message: z
    .string()
    .optional()
    .describe('Message to be sent to the user, in case of an issue'),
})

export type CronData = z.infer<typeof schema>

export async function generateCron(
  prompt: string,
): Promise<
  { type: 'success'; data: CronData } | { type: 'error'; message: string }
> {
  const settings = {
    model: openai('gpt-4o'),
    schema,
    prompt: `
    Generate a single (!) cron schedule and a new description for this prompt: "${prompt}".
    If the prompt doesn't provide enough information or you can't fullfill the request, please leave the schedule and description undefined. 
    Instead provide a message to the user, explaining what they can do to adjust their prompt. Ignore timezones.

    Description:
    The description should be a one sentence description of the schedule, starting with "Every...". This should be based on the schedule, not the original description. Feel free to add additional information like the timezone if needed.

    Cron format:
        Fields:
            - minute (0-59)
            - hour (0-23)
            - day of the month (1-31)
            - month (1-12)
            - day of the week (1-7, starting with Sunday)
            - year (1970-2199)
        Wildcards: 
            * for any value 
            , for a list of values (e.g. 1,2,5)
            - for a range of values (e.g. 1-3)
            / for a step value (e.g. 1/3)
            L for the last day of the month or week
            W for the nearest weekday to the given day-of-the-month
            # for a certain weekday within the month (3#2 = the second Tuesday in the month)
            ? for any value in the day-of-month or day-of-week fields.

    IMPORTANT: THE WILDCARD FOR ANY day-of-month OR day-of-week IS ? AND NOT * !
    `,
  }
  try {
    const { object } = await generateObject(settings)
    console.log(object)
    return { data: object, type: 'success' }
  } catch (error) {
    if (
      error instanceof TypeValidationError ||
      error instanceof JSONParseError
    ) {
      return {
        type: 'error',
        message:
          'The generated schedule is invalid, please try adjusting your prompt slightly',
      }
    }
    return { type: 'error', message: 'An error occurred, please try again' }
  }
}
