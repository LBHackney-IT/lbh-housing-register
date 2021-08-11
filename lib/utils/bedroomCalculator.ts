type People = [number, string[], string[] | null]; // this is causing me headache

export function calculateBedrooms(...people: Array<any>) {
  // one bedroom each...unless it's a couple
  let relationship = false;
  const over16 = people[0].filter(([age, gender, relationshipType]) => {
    if (relationshipType === 'partner') {
      relationship = true;
    }
    return age >= 16;
  }).length;

  const over16CoupleAdjusted = relationship ? over16 - 1 : over16;

  // 0.5 bedroom each.
  const under10 = people[0].filter(([age]) => age < 10).length / 2;

  const over10 = [
    ...people[0]
      .filter(([age]) => age >= 10 && age < 16)
      .map(([age, gender]) => gender)
      .reduce((map, gender) => {
        let count = map.get(gender) ?? 0;
        map.set(gender, count + 1);
        return map;
      }, new Map())
      .entries(),
  ].map(([gender, count]) => {
    // when there's an uneven number of over 10s of a given gender, and an uneven number of under 10s in general...
    if (count % 2 !== 0 && (under10 * 2) % 2 !== 0) {
      const matchedUnder10s = people[0].filter(
        ([age, g]) => age < 10 && g === gender
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
    over16CoupleAdjusted +
    Math.ceil(under10) +
    over10.reduce((acc, [g, c]) => acc + Math.ceil(c), 0);

  return total;
}
