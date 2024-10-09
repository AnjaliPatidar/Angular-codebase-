export interface User {
  countryId: {
    allowDelete: boolean;
    code: string;
    colorCode: string;
    displayName: string;
    flagName: string;
    icon: string;
    listItemId: number;
    listType: string;
  };
  department: string;
  dob: number;
  emailAddress: string;
  // why do we need this? we don't use it
  extension: null;
  firstName: string;
  isModifiable: boolean;
  jobTitle: string;
  lastLoginDate: number;
  lastName: string;
  listitemIdFromSM: number;
  middleName: string;
  // why do we need this? we don't use it
  phoneNumber: string;
  screenName: string;
  source: string;
  statusId: {
    allowDelete: boolean;
    code: string;
    colorCode: string;
    displayName: string;
    flagName: string;
    icon: string;
    listItemId: number;
    listType: string;
  };
  userId: number;
  userImage: string;
  usersGroups: Array<{
    active: boolean;
    color: null;
    createdBy: number;
    createdDate: number;
    description: string;
    // why do we need this? we don't use it
    groupCode: null;
    // why do we need this? we don't use it
    icon: string;
    id: number;
    modifiedDate: number;
    name: string;
    parentGroupId: string;
    remarks: string;
    source: string;
  }>;
  usersRoles: Array<{
    description: string;
    roleId: {
      roleId: number;
      roleName: string;
      icon: string;
      color: string;
      description: string;
      notes: string;
      createdOn: number;
      modifiedOn: number;
      source: string;
      isModifiable: boolean;
      isRemovable: boolean;
      // why do we need this? we don't use it
      externalRoleId: null;
    };
  }>;
}
