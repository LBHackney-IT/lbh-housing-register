import { AddressLookupAddress } from '../../domain/addressLookup';

export interface AddressHistoryEntry {
  postcode: string;
  date: string;
  dateTo: string;
  address: Partial<
    // Using partial rather than union to make the props easier to access.
    AddressLookupAddress & {
      line1: string;
      line2: string;
      town: string;
      county: string;
    }
  >;
}

export interface AddressHistoryDuration {
  from: Date;
  years: number;
  months: number;
  label: string;
}

export function checkAddressHistory(
  entries: AddressHistoryEntry[],
  requiredYears: number
) {
  const [last] = entries.slice(-1);
  const lastDate = new Date(last.date);

  const requiredDate = new Date();
  requiredDate.setFullYear(requiredDate.getFullYear() - requiredYears);
  return lastDate <= requiredDate;
}

export function formatDate(date: Date) {
  return `${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getFullYear()}`;
}

export function calculateDurations(
  entries: AddressHistoryEntry[]
): AddressHistoryDuration[] {
  if (!entries) return [];

  return entries.map(
    (entry): AddressHistoryDuration => {
      const from = new Date(entry.date);

      if (entry.dateTo) {
        const until = new Date(entry.dateTo);

        const untilInMonths = until.getFullYear() * 12 + until.getMonth();
        const fromInMonths = from.getFullYear() * 12 + from.getMonth();

        const years = Math.floor((untilInMonths - fromInMonths) / 12);
        const months = (untilInMonths - fromInMonths) % 12;

        const r = {
          from,
          years,
          months,
          label: `${years} year${years !== 1 ? 's' : ''} ${months} month${
            months !== 1 ? 's' : ''
          } (${formatDate(from)} – ${formatDate(until)})`,
        };
        return r;
      }

      const untilInMonths =
        new Date().getFullYear() * 12 + new Date().getMonth();
      const fromInMonths = from.getFullYear() * 12 + from.getMonth();
      const years = Math.floor((untilInMonths - fromInMonths) / 12);
      const months = (untilInMonths - fromInMonths) % 12;

      const r = {
        from,
        years,
        months,
        label: `${years} year${years !== 1 ? 's' : ''} ${months} month${
          months !== 1 ? 's' : ''
        } (${formatDate(from)} - Now)`,
      };
      return r;
    }
  );
}
