type BedroomNeed = {
  age: number;
  gender: string;
};

export function calculateBedrooms(
  people: BedroomNeed[],
  mainApplicantHasPartnerSharing: boolean
) {
  // one bedroom each...
  const over16 = people.filter(({ age }) => age! >= 16).length;
  // ...except when there's a couple
  const over16Bedrooms = mainApplicantHasPartnerSharing ? over16 - 1 : over16;

  // 0.5 bedroom each.
  const under10 = people.filter(({ age }) => age! < 10).length / 2;

  const over10: [string, number][] = [
    ...people
      .filter(({ age }) => age! >= 10 && age! < 16)
      .map(({ gender }) => gender)
      .reduce((map: Map<string, number>, gender) => {
        let count = map.get(gender) ?? 0;
        map.set(gender, count + 1);
        return map;
      }, new Map())
      .entries(),
  ].map(([gender, count]) => {
    // when there's an uneven number of over 10s of a given gender, and an uneven number of under 10s in general...
    if (count % 2 !== 0 && (under10 * 2) % 2 !== 0) {
      const matchedUnder10s = people.filter(
        ({ age, gender: g }) => age! < 10 && g === gender
      );
      // ...and at least one of the under 10s has this gender then they can share a room.
      if (matchedUnder10s.length) {
        // we can eliminate this over 10 from the count - they'll be added in the roundup of under 10s.
        return [gender, (count - 1) / 2];
      }
    }
    return [gender, count / 2];
  });

  const total =
    over16Bedrooms +
    Math.ceil(under10) +
    over10.reduce((acc, [g, c]) => acc + Math.ceil(c), 0);

  return total;
}
