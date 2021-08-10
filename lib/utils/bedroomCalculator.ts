function calculateBedrooms(...people: Array<any>) {
  // one bedroom each...unless it's a couple
  let relationshipType = people[0].pop();
  let over16 = people.filter(([age, _]) => {
    return age >= 16;
  }).length;

  // 0.5 bedroom each.
  const under10 = people.filter(([age]) => age < 10).length / 2;

  if (relationshipType === 'partner') {
    over16 = over16 - 1;
  }

  const over10 = [
    ...people
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
      const matchedUnder10s = people.filter(
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

  console.log({ over16, under10, over10 });

  const total = over16 + under10 + over10.reduce((acc, [g, c]) => acc + c, 0);

  return total;
}

export function CALCULATE_BEDROOMS(people: Array<any>) {
  const individualBedroom = people
    .map((row) => row.filter((v: string) => v !== ''))
    .map((row) =>
      [...Array(Math.ceil(row.length / 3))].map((_, i) =>
        row.slice(i * 3, i * 3 + 3)
      )
    )
    .map((args) => [calculateBedrooms(...args)]);

  const totalBedrooms = individualBedroom.reduce((acc, cur) => acc + cur[0], 0);

  return Math.ceil(totalBedrooms);
}
