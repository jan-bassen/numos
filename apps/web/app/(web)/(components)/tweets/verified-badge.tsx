import { cn } from '@repo/ui/lib/utils'
import type { TweetUser } from 'react-tweet/api'
import { Verified, VerifiedBusiness, VerifiedGovernment } from 'react-tweet'

type Props = {
  user: TweetUser
  className?: string
}

export const VerifiedBadge = ({ user, className }: Props) => {
  const verified = user.verified || user.is_blue_verified || user.verified_type
  let icon = <Verified />
  let iconClassName: string | null = 'text-[var(--tweet-verified-blue-color)]'

  if (verified) {
    if (!user.is_blue_verified) {
      iconClassName = 'text-[var(--tweet-verified-old-color)]'
    }
    switch (user.verified_type) {
      case 'Government':
        icon = <VerifiedGovernment />
        iconClassName = 'text-[rgb(130, 154, 171)]'
        break
      case 'Business':
        icon = <VerifiedBusiness />
        iconClassName = null
        break
    }
  }

  return verified ? (
    <div className={cn(className, iconClassName)}>{icon}</div>
  ) : null
}
