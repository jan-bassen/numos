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
  // The Twitter syndication API now omits empty entity arrays (hashtags, urls,
  // symbols, user_mentions). react-tweet's enrichTweet iterates them unguarded
  // and throws "entities is not iterable", so normalize them to empty arrays.
  const entities = tweet.entities ?? ({} as Tweet['entities'])
  const enrichedTweet = enrichTweet({
    ...tweet,
    entities: {
      ...entities,
      hashtags: entities.hashtags ?? [],
      urls: entities.urls ?? [],
      user_mentions: entities.user_mentions ?? [],
      symbols: entities.symbols ?? [],
    },
  })
  return (
    <TweetContainer className="!border !text-sm !font-sans !border-border !px-2 !py-1.5 !rounded-3xl !shadow-xs !bg-card">
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
