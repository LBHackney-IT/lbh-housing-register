import { render, screen } from '@testing-library/react';
import Snapshot from './snapshot';
import { Applicant, Application } from '../../domain/HousingApi';

function makeApplicant({
  id,
  firstName,
  surname,
  hasMedicalNeed,
}: {
  id: string;
  firstName?: string;
  surname?: string;
  hasMedicalNeed: boolean;
}): Applicant {
  return {
    person: { id, firstName, surname },
    questions: [
      {
        id: 'medical-needs/medical-needs',
        answer: hasMedicalNeed ? '"yes"' : '"no"',
      },
    ],
  };
}

const APPLICATION_ID = 'app-123';

const baseApplication: Application = {
  id: APPLICATION_ID,
  calculatedBedroomNeed: 1,
  mainApplicant: makeApplicant({
    id: 'person-1',
    firstName: 'Alice',
    surname: 'Smith',
    hasMedicalNeed: false,
  }),
  otherMembers: [],
};

describe('Snapshot – medical need', () => {
  it('shows "No one has stated a medical need." when nobody has a medical need', () => {
    const { container } = render(<Snapshot data={baseApplication} />);

    expect(container).toHaveTextContent('No one has stated a medical need.');
  });

  it('renders no links when nobody has a medical need', () => {
    render(<Snapshot data={baseApplication} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('uses singular phrasing when 1 person has a medical need', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: true,
      }),
    };
    const { container } = render(<Snapshot data={data} />);

    expect(container).toHaveTextContent('1 person');
    expect(container).toHaveTextContent('has stated a medical need');
  });

  it('renders a link with the person name when they have a medical need', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: true,
      }),
    };
    render(<Snapshot data={data} />);

    expect(
      screen.getByRole('link', { name: 'Alice Smith' }),
    ).toBeInTheDocument();
  });

  it('links to the correct applicant view page', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: true,
      }),
    };
    render(<Snapshot data={data} />);

    expect(screen.getByRole('link', { name: 'Alice Smith' })).toHaveAttribute(
      'href',
      `/applications/view/${APPLICATION_ID}/person-1`,
    );
  });

  it('uses plural phrasing when multiple people have a medical need', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: true,
      }),
      otherMembers: [
        makeApplicant({
          id: 'person-2',
          firstName: 'Bob',
          surname: 'Jones',
          hasMedicalNeed: true,
        }),
      ],
    };
    const { container } = render(<Snapshot data={data} />);

    expect(container).toHaveTextContent('2 people');
    expect(container).toHaveTextContent('have stated a medical need');
  });

  it('renders a link for each person with a medical need', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: true,
      }),
      otherMembers: [
        makeApplicant({
          id: 'person-2',
          firstName: 'Bob',
          surname: 'Jones',
          hasMedicalNeed: true,
        }),
      ],
    };
    render(<Snapshot data={data} />);

    expect(screen.getByRole('link', { name: 'Alice Smith' })).toHaveAttribute(
      'href',
      `/applications/view/${APPLICATION_ID}/person-1`,
    );
    expect(screen.getByRole('link', { name: 'Bob Jones' })).toHaveAttribute(
      'href',
      `/applications/view/${APPLICATION_ID}/person-2`,
    );
  });

  it('only links to people who have stated a medical need', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: makeApplicant({
        id: 'person-1',
        firstName: 'Alice',
        surname: 'Smith',
        hasMedicalNeed: false,
      }),
      otherMembers: [
        makeApplicant({
          id: 'person-2',
          firstName: 'Bob',
          surname: 'Jones',
          hasMedicalNeed: true,
        }),
      ],
    };
    render(<Snapshot data={data} />);

    expect(screen.getByRole('link', { name: 'Bob Jones' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Alice Smith' }),
    ).not.toBeInTheDocument();
  });

  it('shows "Unknown" as the link text when the person has no name data', () => {
    const data: Application = {
      ...baseApplication,
      mainApplicant: {
        person: { id: 'person-1' },
        questions: [{ id: 'medical-needs/medical-needs', answer: '"yes"' }],
      },
    };
    render(<Snapshot data={data} />);

    expect(screen.getByRole('link', { name: 'Unknown' })).toBeInTheDocument();
  });
});
