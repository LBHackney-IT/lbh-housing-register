import { useState } from 'react';
import { HeadingOne } from '../../../components/content/headings';
import Layout from '../../../components/layout/resident-layout';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { addResidentFromFormData } from '../../../lib/store/otherMembers';
import { FormData } from '../../../lib/types/form';
import withApplication from '../../../lib/hoc/withApplication';
import AddPersonForm from '../../../components/application/add-person-form';
import ErrorSummary from 'components/errors/error-summary';
import Loading from 'components/loading';
import {
  selectSaveApplicationStatus,
  ApiCallStatusCode,
} from 'lib/store/apiCallsStatus';
import useApiCallSelectorStatus from 'lib/hooks/useApiCallStatus';
import { scrollToError } from 'lib/utils/scroll';
import { Errors } from 'lib/types/errors';

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = '/apply/household';

  const dispatch = useAppDispatch();
  // this is justa typed useSelector
  const saveApplicationStatus = useAppSelector(selectSaveApplicationStatus);
  const [isOver16State, setIsOver16State] = useState(true);
  const [submit, setSubmit] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  useApiCallSelectorStatus({
    selector: saveApplicationStatus,
    userActionCompleted: submit,
    setUserError,
    scrollToError,
    pathToPush: returnHref,
  });

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
  ];

  const formFields = {
    person: {},
  };

  const onSubmit = async (values: FormData) => {
    try {
      dispatch(addResidentFromFormData(values));
      setSubmit(true);
    } catch (error) {
      setUserError(Errors.GENERIC_ERROR);
      scrollToError();
    }
  };

  return (
    <Layout
      pageName="Add person"
      breadcrumbs={breadcrumbs}
      dataTestId="test-application-add-person"
    >
      <HeadingOne content="Add a person to this application" />
      {userError && (
        <ErrorSummary dataTestId="test-add-person-error-summary">
          {userError}
        </ErrorSummary>
      )}
      {saveApplicationStatus?.callStatus === ApiCallStatusCode.PENDING ? (
        <Loading text="Saving..." />
      ) : (
        <AddPersonForm
          applicant={formFields}
          onSubmit={onSubmit}
          isMainApplicant={false}
          buttonText="Add person"
          isOver16={isOver16State}
          setIsOver16State={setIsOver16State}
        />
      )}
    </Layout>
  );
};

export default withApplication(AddPersonToApplication);
