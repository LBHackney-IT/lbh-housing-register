import React from 'react';

import { faker } from '@faker-js/faker';

import { ActivityHistoryPagedResult } from '../../domain/ActivityHistoryApi';
import ApplicationHistory from './ApplicationHistory';

describe('<ApplicationHistory />', () => {
  it('renders', () => {
    const activityId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const oldData = {};
    const newData = { _activityType: 'submittedByResident' };
    const residentName = faker.person.fullName();
    const residentEmail = faker.internet.email();
    const createdAd = faker.date.past().toISOString();

    const history: ActivityHistoryPagedResult = {
      results: [
        {
          id: activityId,
          targetId: applicationId,
          createdAt: createdAd,
          oldData,
          newData,
          authorDetails: {
            fullName: residentName,
            email: residentEmail,
          },
        },
      ],
      paginationDetails: {
        hasNext: false,
        nextToken: '',
      },
    };

    cy.mount(<ApplicationHistory history={history} id={applicationId} />);

    cy.contains('History');
  });
});
