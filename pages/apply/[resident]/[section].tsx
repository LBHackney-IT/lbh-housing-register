import { useRouter } from 'next/router';
import ApplicationForms from '../../../components/application/application-forms';
import Layout from '../../../components/layout/resident-layout';
import withApplication from '../../../lib/hoc/withApplication';
import { applicantHasId, selectApplicant } from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { getApplicationSectionFromId } from '../../../lib/utils/application-forms';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { FormID } from '../../../lib/utils/form-data';
import { getApplicationSectionsForResident } from '../../../lib/utils/resident';
import { useState } from 'react';
import { selectSaveApplicationStatus } from 'lib/store/apiCallsStatus';
import useApiCallStatus from 'lib/hooks/useApiCallStatus';
import { scrollToError } from 'lib/utils/scroll';
import Loading from 'components/loading';
import ErrorSummary from 'components/errors/error-summary';
import Custom404 from '../../404';

const formIds = new Set<string>(Object.values(FormID));

function queryValue(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return '';
}

function isFormId(value: string): value is FormID {
  return formIds.has(value);
}

const ApplicationSection = (): JSX.Element => {
  const router = useRouter();
  const resident = queryValue(router.query.resident);
  const section = queryValue(router.query.section);

  const applicant = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);

  const baseHref = `/apply/${applicant?.person?.id}`;
  const returnHref = '/apply/overview';

  const [isSavingToDatabase, setIsSavingToDatabase] = useState<boolean>(false);
  const applicationSaveStatus = useAppSelector(selectSaveApplicationStatus);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  useApiCallStatus({
    selector: applicationSaveStatus,
    userActionCompleted: hasSubmitted,
    setUserError,
    scrollToError,
    pathToPush: baseHref,
  });

  const sectionGroups =
    applicantHasId(applicant) && isFormId(section)
      ? getApplicationSectionsForResident(
          applicant === mainResident,
          isOver18(applicant),
          applicant.person?.relationshipType === 'partner',
        )
      : [];

  const sectionInfo = isFormId(section)
    ? getApplicationSectionFromId(section, sectionGroups)
    : undefined;
  const sectionName = sectionInfo?.heading || '';

  const breadcrumbs = [
    {
      id: 'apply-overview',
      href: returnHref,
      name: 'Application',
    },
    {
      id: 'apply-resident',
      href: baseHref,
      name: applicant?.person?.firstName || '',
    },
    {
      id: 'apply-resident-section',
      href: `${baseHref}/${section}`,
      name: sectionName,
    },
  ];

  const onSubmit = async () => {
    setHasSubmitted(true);
    setIsSavingToDatabase(true);
  };

  if (!router.isReady) {
    return (
      <Layout pageName="">
        <Loading text="Checking information…" />
      </Layout>
    );
  }

  if (!applicantHasId(applicant) || !sectionInfo || !isFormId(section)) {
    return <Custom404 />;
  }

  return (
    <>
      <Layout pageName={sectionName} breadcrumbs={breadcrumbs}>
        {userError && (
          <ErrorSummary dataTestId="test-agree-terms-error-summary">
            {userError}
          </ErrorSummary>
        )}
        {isSavingToDatabase && !userError ? (
          <Loading text="Saving..." />
        ) : (
          <ApplicationForms
            applicant={applicant}
            sectionGroups={sectionGroups}
            activeStep={section}
            onSubmit={onSubmit}
          />
        )}
      </Layout>
    </>
  );
};

export default withApplication(ApplicationSection);
