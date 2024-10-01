import { Stat } from '../domain/stat';

interface StatsProps {
  className: string;
  stats: Array<Stat>;
}

interface StatItemProps extends Stat {
  index?: number;
}

export function Stats({ className, stats }: StatsProps): JSX.Element {
  return (
    <div className="govuk-grid-row">
      {stats.map((stat, index) => (
        <div key={`${stat.value}-${index}`} className={className}>
          <StatItem index={index} value={stat.value} caption={stat.caption} />
        </div>
      ))}
    </div>
  );
}

export function StatItem({
  index,
  value,
  caption,
}: StatItemProps): JSX.Element {
  return (
    <div className="lbh-stat">
      <strong
        className="lbh-stat__value"
        aria-labelledby={`stat-${index}-caption`}
      >
        {value}
      </strong>
      <span className="lbh-stat__caption" id={`stat-${index}-caption`}>
        {caption}
      </span>
    </div>
  );
}
