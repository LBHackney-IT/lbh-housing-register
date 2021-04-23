import { StatProps } from "./stat"
import Stat from "./stat"

interface StatsProps {
  className: string
  stats: Array<StatProps>
}

export default function Stats({ className, stats }: StatsProps): JSX.Element {
  return (
    <div className="govuk-grid-row">
      {stats.map((stat, index) => (
        <div className={className}>
          <Stat index={index} value={stat.value} caption={stat.caption} />
        </div>
      ))}
    </div>
  )
}
