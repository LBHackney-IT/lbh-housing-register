import { authorizeStaffPage } from 'lib/auth/page';
import { StaffUserWithPermissions } from 'lib/auth/staff';
import { fetchWithSentry } from 'lib/utils/sentry';
import { GetServerSideProps } from 'next';

interface Props {
  header: string;
  user: StaffUserWithPermissions;
}

const ErrorThrowingPage = ({
  header,
  user,
}: Props): React.ReactElement | null => {
  if (user.hasAdminPermissions)
    return (
      <>
        <h1>{header}</h1>

        <ul>
          <button
            onClick={() => {
              throw new Error('ErrorThrowingPage component error');
            }}
          >
            throw frontend error
          </button>

          <button>
            <a href="/throw-error?server=true">throw server error</a>
          </button>

          <button
            onClick={() => {
              fetchWithSentry(
                '/api/applications/throw-error',
                { method: 'GET' },
                {
                  operation: 'sentry_test_api_error',
                  route: '/api/applications/throw-error',
                },
              ).catch((e) => {
                console.log(e);
              });
            }}
          >
            throw api error
          </button>
        </ul>
      </>
    );
  else return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authorization = await authorizeStaffPage(context);
  if ('redirect' in authorization) return authorization;
  const { user } = authorization;

  if (context.query.server) {
    throw new Error('ErrorThrowingPage getServerSideProps error');
  }

  return {
    props: {
      header: 'This page throws errors for testing purposes.',
      user,
    },
  };
};

export default ErrorThrowingPage;
