import Announcement from '../../components/announcement';
import Details from '../../components/details';
import Paragraph from '../../components/content/paragraph';
import { v4 as uniqueID } from 'uuid';
import { Applicant } from '../../domain/HousingApi';

const additionalQuestionsArray = [
  {
    questionId: 'additional-questions/currently-homeless',
    title: 'Household member(s) currently homeless',
  },

  {
    questionId: 'additional-questions/risk-of-homelessness',
    title: 'Household member(s) at risk of homelessness',
  },

  {
    questionId: 'additional-questions/risk-of-domestic-violence',
    title: 'Household member(s) at risk of domestic violence',
  },

  {
    questionId: 'additional-questions/risk-of-gang-violence',
    title: 'Household member(s) at risk of gang violence',
  },
  {
    questionId: 'additional-questions/witness-mobility-scheme',
    title: 'Household member(s) under witness protection',
  },

  {
    questionId: 'additional-questions/employee-hackney-council',
    title:
      'Household member(s) is an employee, or is related to an employee of Hackney Council',
  },
  {
    questionId: 'additional-questions/elected-member-hackney-council',
    title:
      'Household member(s) is an elected member, or is related to an elected member of Hackney Council',
  },
];

interface OverviewAnnouncementProps {
  title: string;
  description: (string | undefined)[] | undefined;
}

function OverviewAnnouncement({
  title,
  description,
}: OverviewAnnouncementProps) {
  return (
    <Announcement variant="info">
      <h3 className="lbh-page-announcement__title">{title}</h3>
      <div className="lbh-page-announcement__content">
        <Details summary="Show details">
          <Paragraph>{description}</Paragraph>
        </Details>
      </div>
    </Announcement>
  );
}

interface OverviewAnnouncementsProps {
  applicant: Applicant;
}

export default function OverviewAnnouncements({
  applicant,
}: OverviewAnnouncementsProps) {
  const questionsAnsweredYes = additionalQuestionsArray
    .map(
      (additionalQuestion) =>
        applicant.questions?.filter((question) =>
          question.id?.includes(additionalQuestion.questionId)
        )[0]
    )
    .filter((question) => question?.answer === '["yes"]');

  const announcementInfo = questionsAnsweredYes.map((questionAnsweredYes) => {
    const detailsQuestion = applicant.questions?.filter((question) =>
      question.id?.includes(`${questionAnsweredYes?.id}-details`)
    );

    const title = additionalQuestionsArray.filter(
      (question) => question.questionId === questionAnsweredYes?.id
    )[0]?.title;

    const description = detailsQuestion?.map((detail) => detail.answer);

    return { title, description };
  });

  return (
    <>
      {announcementInfo.map((announcement) => (
        <OverviewAnnouncement
          key={uniqueID()}
          title={announcement.title}
          description={announcement.description}
        />
      ))}
    </>
  );
}
