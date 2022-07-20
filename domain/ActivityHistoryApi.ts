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
  oldData: any;
  newData: any;
  authorDetails: ActivityHistoryAuthor;
}

export interface IActivityEntity {
  id: string;
  createdAt: string;
  oldData: Partial<Application>;
  newData: Partial<Application>;
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
  oldData: Partial<Application>;
  newData: any;
  authorDetails: ActivityHistoryAuthor;
  activityType: ApplicationActivityType;

  constructor(source: ActivityHistoryResponse) {
    this.id = source.id;
    this.createdAt = source.createdAt;
    this.authorDetails = source.authorDetails;

    this.oldData = this.mapDotNotationToObject(source.oldData);
    this.newData = this.mapDotNotationToObject(source.newData);

    this.activityType = source.newData._activityType as ApplicationActivityType;
  }

  mapDotNotationToObject(source: any): Partial<Application> {
    if (source == null) {
      return {};
    }

    let application: any = {};

    for (const [key, value] of Object.entries(source)) {
      this.stringToObj(key, value, application);
    }

    return application;
  }

  stringToObj(path: string, value: any, obj: any) {
    const parts = path.split('.');
    const last = parts.pop();

    let part;
    while ((part = parts.shift())) {
      if (typeof obj[part] != 'object') obj[part] = {};
      obj = obj[part]; // update "pointer"
    }

    obj[last!] = value;
  }
}
