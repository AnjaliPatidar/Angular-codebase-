export interface AlertFeed {
  assignedAlertsCount: number;
  color: string;
  feedName: string;
  feed_management_id: number;
  groupLevels: FeedGroupLevel[];
  isReviewerRequired: boolean;
  reviewer: any[];
  source: number;
  type: number;
}

export interface FeedGroupLevel {
  feedGroupsId: number;
  feedId?: {
    color: string;
    feedName: string;
    feed_management_id: number;
    isReviewerRequired: boolean;
    source: number;
    type: number;
  };
  groupId?: {
    active: boolean;
    color: string;
    createdBy: number;
    createdDate: number;
    description: string;
    groupCode: string;
    icon: string;
    id: number;
    modifiedDate: number;
    name: string;
    parentGroupId: number;
    remarks: string;
    source: string;
  };
  rank: number;
}

export interface UpdateFeedParams {
  feedName: string;
  color: string;
  type: number;
  source: number;
  groupLevels: FeedGroupLevel[];
  isReviewerRequired: boolean;
  reviewer: any[];
  feed_management_id: number;
}
