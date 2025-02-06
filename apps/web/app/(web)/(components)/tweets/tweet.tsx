import { Suspense } from 'react'
import { getTweet } from 'react-tweet/api'
import { type TweetProps, TweetNotFound, TweetSkeleton } from 'react-tweet'
import { CustomTweet } from '@/app/(web)/(components)/tweets/custom-tweet'

const TweetContent = async ({ id, onError }: TweetProps) => {
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          onError(err)
        } else {
          console.error(err)
        }
      })
    : undefined

  if (!tweet) {
    const NotFound = TweetNotFound
    return <NotFound />
  }

  return <CustomTweet tweet={tweet} />
}

export const Tweet = ({
  fallback = <TweetSkeleton />,
  ...props
}: TweetProps) => (
  <Suspense fallback={fallback}>
    {/* @ts-ignore: Async components are valid in the app directory */}
    <TweetContent {...props} />
  </Suspense>
)
