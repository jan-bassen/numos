import type { Tweet } from 'react-tweet/api'
import {
  TweetContainer,
  TweetBody,
  TweetActions,
  QuotedTweet,
  enrichTweet,
  TweetInfo,
} from 'react-tweet'
import { TweetHeader } from '@/app/(web)/(components)/tweets/tweet-header'

export const CustomTweet = ({ tweet }: { tweet: Tweet }) => {
  const enrichedTweet = enrichTweet(tweet)
  return (
    <TweetContainer className="!border !text-sm !font-inter !border-border !px-2 !py-1.5 !rounded-3xl !shadow-sm !bg-card">
      <TweetHeader tweet={enrichedTweet} />
      <div className="[&>*]:!text-base min-h-36 pb-2 font-normal">
        <TweetBody tweet={enrichedTweet} />
      </div>
      {enrichedTweet.quoted_tweet && (
        <QuotedTweet tweet={enrichedTweet.quoted_tweet} />
      )}
      <TweetInfo tweet={enrichedTweet} />
      <TweetActions tweet={enrichedTweet} />
      {/* We're not including the `TweetReplies` component that adds the reply button */}
    </TweetContainer>
  )
}
