import {
  getRedirect,
  getSession,
  HackneyGoogleUserWithPermissions,
} from 'lib/utils/googleAuth';
import { GetServerSideProps } from 'next';

interface Props {
  header: string;
  user: HackneyGoogleUserWithPermissions;
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
              fetch('/api/applications/throw-error', {}).catch((e) => {
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
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      redirect: {
        permanent: false,
        destination: redirect,
      },
    };
  }

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
