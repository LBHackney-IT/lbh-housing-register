import { GetServerSideProps } from 'next';
import AddressDetails from '../../../components/applications/address-details';
import ContactDetails from '../../../components/applications/contact-details';
import OtherMembers from '../../../components/applications/other-members';
import PersonalDetails from '../../../components/applications/personal-details';
import { HeadingOne, HeadingTwo } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Layout from '../../../components/layout/staff-layout';
import Tag from '../../../components/tag';
import { HackneyGoogleUser } from '../../../domain/HackneyGoogleUser';
import { Application } from '../../../domain/HousingApi';
import { UserContext } from '../../../lib/contexts/user-context';
import { getApplication } from '../../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../../lib/utils/auth';
import { getStatusTag } from '../../../lib/utils/tag';

interface PageProps {
  user: HackneyGoogleUser;
  data: Application;
}

export default function ApplicationPage({
  user,
  data,
}: PageProps): JSX.Element {
  return (
    <UserContext.Provider value={{ user }}>
      <Layout>
        <HeadingOne content={`Application #${data.id}`} />
        <Tag content={data.status || ""} className={getStatusTag(data.status|| "")} />

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <PersonalDetails
              heading="Personal details"
              applicant={data.mainApplicant}
            />
            <ContactDetails
              heading="Contact details"
              contact={data.mainApplicant?.contactInformation}
            />
            <AddressDetails
              heading="Current accommodation"
              address={data.mainApplicant?.address}
            />
          </div>
          <div className="govuk-grid-column-one-third">
            {data.otherMembers && (
              <OtherMembers
                heading="Other Members"
                others={data.otherMembers}
              />
            )}
            <HeadingTwo content="Some other info" />
            <Paragraph>
              <strong>Lorem ipsum</strong> dolor sit amet, consectetur
              adipiscing elit. Pellentesque mi ex, maximus tempus condimentum
              eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra
              ultricies, tellus lacus fringilla tortor, at blandit purus diam et
              augue.
            </Paragraph>
          </div>
        </div>
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(
    process.env.AUTHORISED_ADMIN_GROUP as string,
    user
  );
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  const { id } = context.params as {
    id: string;
  };

  const data = await getApplication(id);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { user, data } };
};
