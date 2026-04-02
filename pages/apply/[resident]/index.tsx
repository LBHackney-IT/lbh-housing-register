import Link from 'next/link';
import { useRouter } from 'next/router';
import { HeadingTwo } from '../../../components/content/headings';
import DeleteLink from '../../../components/delete-link';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
  SummaryListActions,
  SummaryListRow,
  SummaryListValue,
} from '../../../components/summary-list';
import Tag from '../../../components/tag';
import {
  ApplicantWithPersonID,
  getQuestionValue,
  selectApplicant,
} from '../../../lib/store/applicant';
import { useAppSelector, useAppDispatch } from '../../../lib/store/hooks';
import { removeApplicant } from '../../../lib/store/otherMembers';
import {
  applicationSteps,
  getApplicationSectionsForResident,
} from '../../../lib/utils/resident';
import Custom404 from '../../404';
import Button, { ButtonLink } from '../../../components/button';
import { isOver18 } from '../../../lib/utils/dateOfBirth';
import { FormID } from '../../../lib/utils/form-data';
import { checkEligible } from '../../../lib/utils/form';
import withApplication from '../../../lib/hoc/withApplication';
import {
  ApiCallStatusCode,
  selectSaveApplicationStatus,
} from 'lib/store/apiCallsStatus';
import { useEffect, useState } from 'react';
import Loading from 'components/loading';

function residentIdFromQuery(
  query: ReturnType<typeof useRouter>['query'],
): string {
  const raw = query.resident;
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return '';
}

const ResidentIndex = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const residentId = residentIdFromQuery(router.query);

  const currentResident = useAppSelector(selectApplicant(residentId)) as
    | ApplicantWithPersonID
    | undefined;
  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  const application = useAppSelector((store) => store.application);

  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const returnHref = '/apply/overview';
  const [userHasSaved, setUserHasSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEligible, setIsEligible] = useState<boolean>(true);
  const roomNeedsCompleted = getQuestionValue(
    application.mainApplicant?.questions,
    FormID.CURRENT_ACCOMMODATION,
    'sectionCompleted',
  );

  // Only check eligibility when the room needs completed or the resident is under 18
  useEffect(() => {
    if (
      roomNeedsCompleted ||
      (application.mainApplicant && !isOver18(application.mainApplicant))
    ) {
      const [eligibilityStatus] = checkEligible(application);
      setIsEligible(eligibilityStatus);
    }
  }, [
    application.mainApplicant?.questions,
    application.mainApplicant?.person?.dateOfBirth,
  ]);

  // useEffect to stop router.push firing multiple times (summary path inlined in effect)
  useEffect(() => {
    if (!router.isReady || !residentId) return;
    if (
      !isEligible &&
      currentResident &&
      mainResident &&
      currentResident === mainResident
    ) {
      router.push(`/apply/${currentResident.person.id}/summary`);
    }
  }, [
    isEligible,
    router,
    router.isReady,
    residentId,
    currentResident,
    mainResident,
  ]);

  useEffect(() => {
    if (userHasSaved && currentResident) {
      setIsSaving(true);
      dispatch(removeApplicant(currentResident.person.id));
      setUserHasSaved(false);
    }

    if (isSaving) {
      if (saveApplicationStatus?.callStatus === ApiCallStatusCode.FULFILLED) {
        router.push(returnHref);
      }

      if (saveApplicationStatus?.callStatus === ApiCallStatusCode.REJECTED) {
        router.push(
          {
            pathname: returnHref,
            query: {
              error: 'Unable to delete household member. Please try again.',
            },
          },
          returnHref,
        );
      }
    }
  }, [saveApplicationStatus?.callStatus, userHasSaved]);

  //render simple layout without loading application when saving
  if (isSaving) {
    return (
      <Layout pageName="Person overview" pageLoadsApplication={false}>
        <Loading text="Saving..." />
      </Layout>
    );
  }
  // Client navigations can render once before `query` is populated — avoid false 404.
  if (!router.isReady) {
    return (
      <Layout pageName="Person overview" pageLoadsApplication={false}>
        <Loading text="Loading..." />
      </Layout>
    );
  }
  if (!residentId) {
    return <Custom404 />;
  }
  //redirect when applicant details missing and not saving
  if (!currentResident || !mainResident) {
    return <Custom404 />;
  }

  const baseHref = !isSaving ? `/apply/${currentResident.person?.id}` : '';

  const breadcrumbs = !isSaving
    ? [
        {
          id: 'apply-overview',
          href: returnHref,
          name: 'Application',
        },
        {
          id: 'apply-resident',
          href: baseHref,
          name: currentResident.person?.firstName || '',
        },
      ]
    : [];

  const steps = getApplicationSectionsForResident(
    currentResident === mainResident,
    isOver18(currentResident),
    currentResident.person.relationshipType === 'partner',
  );

  const tasks = applicationSteps(
    currentResident,
    currentResident === mainResident,
  );

  const sectionNames: FormID[] = [];
  steps.forEach((step) => {
    step.sections.forEach((section) => {
      sectionNames.push(section.id);
    });
  });

  const onDelete = () => {
    setUserHasSaved(true);
  };

  const goBack = () => {
    router.push('/apply/overview');
  };

  const isSectionActive = (formId: FormID) => {
    const indexOfSectionName = sectionNames.indexOf(formId);

    // First Section is always unlocked
    if (indexOfSectionName === 0) {
      return true;
    }

    // Has previous section been completed?
    return getQuestionValue(
      currentResident.questions,
      sectionNames[indexOfSectionName - 1],
      'sectionCompleted',
      false,
    );
  };

  const cantStartYetTag = (formID: FormID) => {
    const sectionActive = isSectionActive(formID);
    return sectionActive ? (
      <Tag content="To do" />
    ) : (
      <Tag content="Can't start yet" variant="grey" />
    );
  };

  return (
    <Layout
      pageName="Person overview"
      breadcrumbs={breadcrumbs}
      dataTestId="test-apply-resident-index-page"
    >
      <h1 className="lbh-heading-h1" style={{ marginBottom: '40px' }}>
        <span className="govuk-hint lbh-hint">Complete information for:</span>
        {`${currentResident.person?.firstName} ${currentResident.person?.surname}`}
      </h1>
      {steps.map((step, index) => (
        <div key={index}>
          <HeadingTwo content={step.heading} />
          <SummaryList>
            {step.sections.map((formStep, index) => (
              <SummaryListRow key={index}>
                <SummaryListValue>
                  {isSectionActive(formStep.id) ? (
                    <Link
                      href={`${baseHref}/${formStep.id}`}
                      className="lbh-link"
                    >
                      {formStep.heading}
                    </Link>
                  ) : (
                    formStep.heading
                  )}
                </SummaryListValue>
                <SummaryListActions>
                  {getQuestionValue(
                    currentResident.questions,
                    formStep.id,
                    'sectionCompleted',
                    false,
                  ) ? (
                    <Tag content="Completed" variant="green" />
                  ) : (
                    cantStartYetTag(formStep.id)
                  )}
                </SummaryListActions>
              </SummaryListRow>
            ))}
          </SummaryList>
        </div>
      ))}
      {tasks.remaining == 0 && (
        <ButtonLink
          href={`/apply/${currentResident.person?.id}/summary/`}
          dataTestId="test-apply-resident-index-check-answers-button"
        >
          Check answers
        </ButtonLink>
      )}
      <br />
      <Button onClick={goBack} secondary={true}>
        Save and go back
      </Button>
      {currentResident !== mainResident && (
        <DeleteLink
          content="Delete this information"
          details="This information will be permanently deleted."
          onDelete={onDelete}
          mainButtonTestId="test-apply-resident-index-delete-this-information-button"
          dialogConfirmButtonTestId="test-apply-resident-index-delete-this-information-confirm-button"
        />
      )}
    </Layout>
  );
};

export default withApplication(ResidentIndex);
