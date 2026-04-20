import { Application } from './HousingApi';

export interface ActivityHistoryPagedResult {
  results: ActivityHistoryResponse[];
  paginationDetails: PaginationDetails;
}

export interface PaginationDetails {
  hasNext: boolean;
  nextToken: string;
}

export interface ActivityHistoryResponse {
  id: string;
  targetId: string;
  createdAt: string;
  oldData: unknown;
  newData: unknown;
  authorDetails: ActivityHistoryAuthor;
}

/** Activity payloads include dotted keys and ad hoc fields (e.g. activityData) not on Application. */
export type ActivityHistoryData = Partial<Application> &
  Record<string, unknown>;

export interface IActivityEntity {
  id: string;
  createdAt: string;
  oldData: ActivityHistoryData;
  newData: ActivityHistoryData;
  authorDetails: ActivityHistoryAuthor;
}

export interface ActivityHistoryAuthor {
  fullName: string;
  email: string;
}

export enum ActivityHistoryType {
  Create = 0,
  Update = 1,
  Delete = 2,
  Migrate = 3,
}

export enum ApplicationActivityType {
  AssignedToChangedByUser = 'AssignedToChangedByUser',
  BandChangedByUser = 'BandChangedByUser',
  BedroomNeedChangedByUser = 'BedroomNeedChangedByUser',
  BiddingNumberChangedByUser = 'BiddingNumberChangedByUser',
  CaseViewedByUser = 'CaseViewedByUser',
  Created = 'Created',
  EffectiveDateChangedByUser = 'EffectiveDateChangedByUser',
  HouseholdApplicantChangedByUser = 'HouseholdApplicantChangedByUser',
  HouseholdApplicantRemovedByUser = 'HouseholdApplicantRemovedByUser',
  ImportedFromLegacyDatabase = 'ImportedFromLegacyDatabase',
  InformationReceivedDateChangedByUser = 'InformationReceivedDateChangedByUser',
  MainApplicantChangedByUser = 'MainApplicantChangedByUser',
  NoteAddedByUser = 'NoteAddedByUser',
  SensitivityChangedByUser = 'SensitivityChangedByUser',
  StatusChangedByUser = 'StatusChangedByUser',
  SubmittedByResident = 'SubmittedByResident',
}

export enum ApplicationActivityData {
  NoteAddedByUser = 'NoteAddedByUser',
}

export class ActivityEntity implements IActivityEntity {
  id: string;
  createdAt: string;
  oldData: ActivityHistoryData;
  newData: ActivityHistoryData;
  authorDetails: ActivityHistoryAuthor;
  activityType: ApplicationActivityType;

  constructor(source: ActivityHistoryResponse) {
    this.id = source.id;
    this.createdAt = source.createdAt;
    this.authorDetails = source.authorDetails;

    this.oldData = this.mapDotNotationToObject(
      source.oldData,
    ) as ActivityHistoryData;
    this.newData = this.mapDotNotationToObject(
      source.newData,
    ) as ActivityHistoryData;

    this.activityType = (source.newData as { _activityType?: string })
      ._activityType as ApplicationActivityType;
  }

  mapDotNotationToObject(source: unknown): ActivityHistoryData {
    if (source == null || typeof source !== 'object') {
      return {};
    }

    const application: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      source as Record<string, unknown>,
    )) {
      this.stringToObj(key, value, application);
    }

    return application as ActivityHistoryData;
  }

  stringToObj(path: string, value: unknown, obj: Record<string, unknown>) {
    const parts = path.split('.');
    const last = parts.pop();

    let current: Record<string, unknown> = obj;
    let part: string | undefined;
    while ((part = parts.shift())) {
      const next = current[part];
      if (typeof next !== 'object' || next === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    if (last !== undefined) {
      current[last] = value;
    }
  }
}
