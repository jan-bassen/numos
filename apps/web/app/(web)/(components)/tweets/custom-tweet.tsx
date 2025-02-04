import type { Tweet } from 'react-tweet/api'
import {
  TweetContainer,
  TweetBody,
  TweetActions,
  QuotedTweet,
  enrichTweet,
} from 'react-tweet'
import { TweetHeader } from '@/app/(web)/(components)/tweets/tweet-header'

export const CustomTweet = ({ tweet }: { tweet: Tweet }) => {
  const enrichedTweet = enrichTweet(tweet)
  return (
    <TweetContainer className="!border !border-border !shadow-md">
      <TweetHeader tweet={enrichedTweet} />
      <div className="[&>*]:!text-base min-h-36 py-2 font-normal">
        <TweetBody tweet={enrichedTweet} />
      </div>
      {enrichedTweet.quoted_tweet && (
        <QuotedTweet tweet={enrichedTweet.quoted_tweet} />
      )}
      <TweetActions tweet={enrichedTweet} />
      {/* We're not including the `TweetReplies` component that adds the reply button */}
    </TweetContainer>
  )
}
