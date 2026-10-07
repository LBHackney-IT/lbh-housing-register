/** @jest-environment node */

import type { GetServerSidePropsContext } from 'next';
import { createRequest, createResponse } from 'node-mocks-http';

import * as pageAuth from '../../../../lib/auth/page';
import * as applicationApi from '../../../../lib/gateways/applications-api';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../../../testUtils/userHelper';
import { getServerSideProps } from '../../../../pages/applications/reports';

const context = {
  req: createRequest(),
  res: createResponse(),
  query: {},
  resolvedUrl: '/applications/reports',
} as GetServerSidePropsContext;

describe('reports page authorization', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    process.env.AUTHORISED_MANAGER_GROUP = 'authorized-manager-group';
  });

  it('does not load report data when the manager-group gate rejects staff', async () => {
    jest.spyOn(pageAuth, 'authorizeStaffPage').mockResolvedValue({
      redirect: {
        permanent: false,
        destination: '/access-denied',
      },
    });
    const listReports = jest.spyOn(applicationApi, 'listNovaletExports');

    await expect(getServerSideProps(context)).resolves.toEqual({
      redirect: {
        permanent: false,
        destination: '/access-denied',
      },
    });

    expect(pageAuth.authorizeStaffPage).toHaveBeenCalledWith(context, {
      requiredGroup: 'authorized-manager-group',
    });
    expect(listReports).not.toHaveBeenCalled();
  });

  it('loads report data after the manager-group gate accepts staff', async () => {
    const user = generateHRUserWithPermissions(UserRole.Manager);
    jest.spyOn(pageAuth, 'authorizeStaffPage').mockResolvedValue({ user });
    const reports = [
      {
        fileName: 'novalet.csv',
        lastModified: '2026-09-01',
        size: 12,
        attributes: {
          approvedOn: '',
          lastDownloadedOn: '',
          approvedBy: '',
        },
      },
    ];
    jest.spyOn(applicationApi, 'listNovaletExports').mockResolvedValue(reports);

    await expect(getServerSideProps(context)).resolves.toEqual({
      props: { user, reportsData: reports },
    });

    expect(applicationApi.listNovaletExports).toHaveBeenCalledWith(30);
  });
});
