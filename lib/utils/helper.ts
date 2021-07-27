export const extractAdditionalResidentFromData = (
  data: any,
  countOfApplicants: any
) => {
  const fields = ['title', 'firstName', 'lastName', 'sex', 'dateOfBirth'];

  // 1. Remove main resident from object
  // 2. Combine person data that belong together
  // 3. Remove the 'additional-x' from names
  // 4. Return || update store accordingly

  // 1
  let additionalResidents: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (!fields.includes(key)) {
      additionalResidents[key] = value;
    }
  }

  // 2 & 3
  let orderResidentsTogether: any = {};
  let includedFields: any = {};
  for (let x = 1; x <= countOfApplicants; x++) {
    for (const [key, value] of Object.entries(additionalResidents)) {
      if (key.indexOf(x.toString())) {
        includedFields[key.split('-')[0]] = value;
        orderResidentsTogether[`person${x}`] = includedFields;
      }
    }
  }
  // 4
  return orderResidentsTogether;
};

export const extractMainResidentFromData = (data: any) => {
  let mainResident: any = {};
  const expectedFields = ['title', 'firstName', 'lastName', 'sex', 'dateOfBirth'];

  for (const [key, value] of Object.entries(data)) {
    if (expectedFields.includes(key)) {
      mainResident[key] = value;
    }
  }
  return mainResident;
};
