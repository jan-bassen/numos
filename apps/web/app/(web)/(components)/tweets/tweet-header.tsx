import { cn } from '@repo/ui/lib/utils'
import type { TwitterComponents, EnrichedTweet } from 'react-tweet'
import Image from 'next/image'
import Link from 'next/link'
import { VerifiedBadge } from '@/app/(web)/(components)/tweets/verified-badge'

type Props = {
  tweet: EnrichedTweet
  components?: TwitterComponents
}

export const TweetHeader = ({ tweet }: Props) => {
  const { user } = tweet

  return (
    <div className="flex items-center gap-5 overflow-hidden whitespace-nowrap break-words pb-[0.75rem] text-[var(--tweet-header-font-size)] leading-[var(--tweet-header-line-height)]">
      <a
        href={tweet.url}
        className="relative size-12"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={cn(
            'absolute grid size-12 shrink-0 place-items-center overflow-hidden rounded-full',
            user.profile_image_shape === 'Square' && 'rounded-[4px]',
          )}
        >
          <Image
            width={64}
            height={64}
            className="size-10 rounded-full"
            unoptimized
            src={user.profile_image_url_https}
            alt={user.name}
          />
        </div>
        <div className="absolute size-full overflow-hidden rounded-full">
          <div className="size-full shadow-sm transition-colors duration-200 hover:bg-[rgba(26,26,26,0.15)]" />
        </div>
      </a>
      <div className="my-2 flex w-full flex-col">
        <a
          href={tweet.url}
          className="flex items-center text-inherit no-underline hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
            <span title={user.name}>{user.name}</span>
          </div>
          <VerifiedBadge user={user} className="inline-flex" />
        </a>
        <div className="flex">
          <a
            href={tweet.url}
            className="overflow-hidden text-ellipsis text-[var(--tweet-font-color-secondary)] no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span title={`@${user.screen_name}`}>@{user.screen_name}</span>
          </a>
        </div>
      </div>
      <Link
        href={tweet.url}
        className="mx-4 w-6 shrink-0"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Twitter"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="color-[var(--tweet-twitter-icon-color)] size-6 select-none fill-current"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </g>
        </svg>
      </Link>
    </div>
  )
}
