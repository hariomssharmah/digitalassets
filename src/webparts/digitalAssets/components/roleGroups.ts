export type UserRole =
  | 'studio'
  | 'assetCoordinator'
  | 'editor'
  | 'categoryManager'
  | 'reader'
  | 'administrator';

export const SHAREPOINT_ROLE_GROUPS: { [role in Exclude<UserRole, 'reader'>]: string } = {
  studio: 'Studios Users',
  assetCoordinator: 'Asset Coordinator Users',
  editor: 'Editor Users',
  categoryManager: 'Category Manager Users',
  administrator: 'Administrator Users'
};

const ROLE_PRECEDENCE: Exclude<UserRole, 'reader'>[] = [
  // Prefer an explicit workspace role when a user is also in the default Readers group.
  'administrator',
  'assetCoordinator',
  'categoryManager',
  'editor',
  'studio'
];

export function resolveUserRole(
  userGroupNames: string[],
  defaultReadersGroupName: string | undefined
): UserRole | undefined {
  const normalizedUserGroups = userGroupNames.map(groupName => groupName.trim().toLowerCase());

  for (let index = 0; index < ROLE_PRECEDENCE.length; index += 1) {
    const role = ROLE_PRECEDENCE[index];
    if (normalizedUserGroups.indexOf(SHAREPOINT_ROLE_GROUPS[role].toLowerCase()) !== -1) {
      return role;
    }
  }

  if (
    defaultReadersGroupName &&
    normalizedUserGroups.indexOf(defaultReadersGroupName.trim().toLowerCase()) !== -1
  ) {
    return 'reader';
  }

  return undefined;
}
