import { useState } from 'react';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { agree } from '../../lib/store/mainApplicant';
import { getFormData, FormID } from '../../lib/utils/form-data';
import Form from '../../components/form/form';
import withApplication from '../../lib/hoc/withApplication';
import {
  selectSaveApplicationStatus,
  ApiCallStatusCode,
} from 'lib/store/apiCallsStatus';
import ErrorSummary from 'components/errors/error-summary';
import useApiCallSelectorStatus from 'lib/hooks/useApiCallStatus';
import { scrollToError } from '../../lib/utils/scroll';
import { Errors } from 'lib/types/errors';
import Loading from 'components/loading';

const ApplicationTermsPage = (): JSX.Element => {
  // TODO: might not be right place for this,
  // but we need to ensure new user is linked to application
  const dispatch = useAppDispatch();
  const applicationId = useAppSelector((store) => store.application.id);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [userError, setUserError] = useState<string | null>(null);

  const onSave = () => {
    if (!applicationId) {
      throw new Error('No application.');
    }
    try {
      dispatch(agree());
      setHasSaved(true);
    } catch (error) {
      console.error('Error saving agreement:', error);
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  useApiCallSelectorStatus({
    selector: saveApplicationStatus,
    userActionCompleted: hasSaved,
    setUserError,
    scrollToError,
    pathToPush: '/apply/household',
  });

  return (
    <Layout pageName="Agreement" dataTestId="test-agree-terms-page">
      <HeadingOne content="Confidentiality and data protection" />
      {userError && (
        <ErrorSummary dataTestId="test-agree-terms-error-summary">
          {userError}
        </ErrorSummary>
      )}

      <Paragraph>
        We will use the information given on the form to help us decide about
        your application for housing. This information will be placed on our
        system so we can assess your priority and housing needs. We will ensure
        confidentiality is maintained throughout and your data protected.
      </Paragraph>

      <Paragraph>
        We have a duty to protect public funds. In order to detect and prevent
        fraud we are required to share information with other public sector
        agencies or any person or organisation administering public funds such
        as central government departments or other Council teams such as housing
        benefits.
      </Paragraph>

      <Paragraph>
        It is a criminal offence to give false or misleading information or to
        hold back relevant information concerning your application.
      </Paragraph>

      <Paragraph>
        You have the right to ask the Council for a copy of your data and for a
        description of how it is being used and to whom it is being disclosed.
      </Paragraph>

      <Paragraph>
        Please{' '}
        <a
          className="lbh-link lbh-link--no-visited-state"
          href="https://hackney.gov.uk/privacy"
        >
          read our main privacy notice
        </a>{' '}
        for more information.
      </Paragraph>
      {saveApplicationStatus?.callStatus === ApiCallStatusCode.PENDING ? (
        <Loading text="Saving..." />
      ) : (
        <Form
          buttonText="Save and continue"
          formData={getFormData(FormID.AGREEMENT)}
          onSave={onSave}
        />
      )}
    </Layout>
  );
};

export default withApplication(ApplicationTermsPage);
