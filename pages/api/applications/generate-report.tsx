import { createObjectCsvStringifier } from 'csv-writer';
import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { PaginatedApplicationListResponse } from '../../../domain/HousingApi';
import { getApplications } from '../../../lib/gateways/applications-api';
import { getAuth, getSession } from '../../../lib/utils/googleAuth';
import { calculateBedroomsFromApplication } from '../../../lib/utils/bedroomCalculator';
import { ApplicationStatus } from '../../../lib/types/application-status';

const CSVColumns = [
  'HousingRegisterRef',
  'Title',
  'FirstName',
  'FamilyName',
  'Address1',
  'Address2',
  'Address3',
  'Address4',
  'Address5',
  'Postcode',
  'HomeTelephone',
  'WorkTelephone',
  'Email',
  'NINumber',
  'Sex',
  'RegistrationDate',
  'EffectiveDate',
  'ApplicantType',
  'MinimumBedSize',
  'MaximumBedSize',
  'DateOfBirth',
  'OlderPersonsAssessement',
  'MobilityAssessment',
  'AdditionalBandingInfo',
  'MedicalRequirements',
  'Offered',
  'EthnicOrigin',
  'Decant',
  'AHRCode',
  'AutoBidPref_MobilityStandard',
  'AutoBidPref_WheelChairStandard',
  'AutoBidPref_AdaptedStandard',
] as const;

type CSVRow = { [Key in typeof CSVColumns[number]]: string | null };

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      const user = getSession(req);

      const auth = getAuth(
        process.env.AUTHORISED_MANAGER_GROUP as string,
        user
      );
      if (!('user' in auth)) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'access denied' });
        return;
      }

      const csv = createObjectCsvStringifier({
        header: CSVColumns.map((id) => ({ id, title: id })),
      });

      try {
        const firstPage = await getApplications(0);
        if (!firstPage) {
          throw new Error('Cannot get application data');
        }
        let pages: CSVRow[][] = [batchToCSV(firstPage)];
        for (let i = 1; i < firstPage.totalNumberOfPages; i++) {
          const r = await getApplications(i);
          if (r) {
            pages.push(batchToCSV(r));
          }
        }

        res.status(StatusCodes.OK);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment;filename=LBH-housing-register-${new Date().toLocaleDateString()}.csv`
        );
        res.send(csv.getHeaderString() + csv.stringifyRecords(pages.flat()));
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to generate report' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;

/*
HousingRegisterRef                u_novalet_ref
Title                             MainApplicant
FirstName                         MainApplicant
FamilyName                        MainApplicant
Address1                          MainApplicant
Address2                          MainApplicant
Address3                          MainApplicant
Address4                          MainApplicant
Address5                          MainApplicant
Postcode                          MainApplicant
HomeTelephone                     MainApplicant
WorkTelephone                     [we're not collecting]
Email                             ''
NINumber                          MainApplicant
Sex                               "M" or "F"
RegistrationDate                  Submitted date
EffectiveDate                     Application date
ApplicantType                     ? Could this be band? Sample data included URG and RES as values. Urgent?
MinimumBedSize                    Calculated bedroom count minus one min zero.
MaximumBedSize                    Calculated bedroom count
DateOfBirth                       MainApplicant
OlderPersonsAssessement           ''
MobilityAssessment                ''
AdditionalBandingInfo             ''
MedicalRequirements               ?
Offered                           ? status = 4 then "Y" , 8 then "N"
EthnicOrigin                      ? Encoded AOO and TCY
Decant                            ? Y or N
AHRCode                           ?
AutoBidPref_MobilityStandard      ?
AutoBidPref_WheelChairStandard    ?
AutoBidPref_AdaptedStandard       ?
*/

function batchToCSV(page: PaginatedApplicationListResponse): CSVRow[] {
  return page.results
    .filter((x) => x.status !== ApplicationStatus.DRAFT && x.assessment?.biddingNumber)
    .map((result): CSVRow => {
      const bedroomNeed =
        result.assessment?.bedroomNeed ??
        calculateBedroomsFromApplication(result);
      return {
        HousingRegisterRef: result.assessment?.biddingNumber ?? null,
        Title: result.mainApplicant?.person?.title ?? null,
        FirstName: result.mainApplicant?.person?.firstName ?? null,
        FamilyName: result.mainApplicant?.person?.surname ?? null,
        Address1: result.mainApplicant?.address?.addressLine1 ?? null,
        Address2: result.mainApplicant?.address?.addressLine2 ?? null,
        Address3: result.mainApplicant?.address?.addressLine3 ?? null,
        Address4: null,
        Address5: null,
        Postcode: result.mainApplicant?.address?.postcode ?? null,
        HomeTelephone:
          result.mainApplicant?.contactInformation?.phoneNumber ?? null,
        WorkTelephone: null,
        Email: result.mainApplicant?.contactInformation?.emailAddress ?? null,
        NINumber: result.mainApplicant?.person?.nationalInsuranceNumber ?? null,
        Sex: result.mainApplicant?.person?.gender ?? null,
        RegistrationDate: result.submittedAt ?? '',
        EffectiveDate: result.assessment?.effectiveDate ?? '',
        ApplicantType: '',
        MinimumBedSize: Math.max(0, bedroomNeed - 1).toString(),
        MaximumBedSize: Math.max(0, bedroomNeed).toString(),
        DateOfBirth: result.mainApplicant?.person?.dateOfBirth ?? null,
        OlderPersonsAssessement: '',
        MobilityAssessment: '',
        AdditionalBandingInfo: '',
        MedicalRequirements: '',
        Offered: '',
        EthnicOrigin: '',
        Decant: '',
        AHRCode: '',
        AutoBidPref_MobilityStandard: '',
        AutoBidPref_WheelChairStandard: '',
        AutoBidPref_AdaptedStandard: '',
      };
    });
}
