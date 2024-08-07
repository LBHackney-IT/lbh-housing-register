const disqualificationReasonOptions = {
  inUkToStudy: 'You are in the UK to study',
  inUkOnVisa: 'You are in the UK on a work or study visa',
  notGrantedSettledStatus:
    'You have not been granted settled status or pre-settled status',
  sponseredToStayInUk: 'You are receiving sponsorship to stay in the UK',
  limitedLeaveToRemainInUk:
    'You have Limited Leave to Remain with no recourse to public funds',
  incomeOver80000: 'Your household income is over £80,000 a year',
  incomeOver100000: 'Your household income is over £100,000 a year',
  assetsOver80000:
    'Your household has over £80,000 in savings and capital assets',
  hasCourtOrder:
    'You are unable to reside in the borough due to a court order or an injunction',
  notResidingInHackneyLast3Years:
    'You have not been continuously residing in Hackney for the last 3 years and you do not fall within any of the listed exceptions',
  squatting:
    'You are squatting and you have not been granted a court order allowing you to join the housing register',
  intentionallyHomeless:
    'You have previously been found to be Intentionally Homeless within the last two years',
  rentArrears:
    'You are in 4 or more weeks of rent arrears, council tax or service charges which is not due to a delay in processing your housing benefits or Universal Credit claim, and you have not made an agreement with the landlord',
  ownOrSoldProperty:
    'You own a property, or have sold a property in the last 5 years, and do not fall within any of the listed exceptions',
  onAnotherHousingRegister:
    'You have been accepted onto another local authority’s housing register',
  ableToBuyProperty: 'You are able to buy a property to meet your needs',
  haveSubletAccomodation:
    'You have sublet your accommodation without permission',
  notLackingRooms:
    'Based on our calculations, you are not lacking two or more rooms',
  under18YearsOld: 'You are under 18 years old',
};

export type DisqualificationReason = keyof typeof disqualificationReasonOptions;

export function getDisqualificationReasonOption(
  reason: DisqualificationReason
): string {
  if (!disqualificationReasonOptions[reason]) {
    console.error(`Unkown disqualification reason: ${reason}`);
  }
  return disqualificationReasonOptions[reason];
}
