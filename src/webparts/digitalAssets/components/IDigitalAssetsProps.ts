import type { UserRole } from './roleGroups';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDigitalAssetsProps {
  context: WebPartContext;
  description: string;
  environmentMessage: string;
  userDisplayName: string;
  role?: UserRole;
  roleError?: string;
}

export interface IDigitalAssetsWebPartProps {
  description: string;
}

export interface IHeaderProps {
  role?: UserRole;
}

export interface IOverviewPageProps {
  description: string;
  userDisplayName: string;
}

export interface IDashboardProps {
  context: WebPartContext;
  description: string;
  userDisplayName: string;
  role?: UserRole;
  roleError?: string;
}

export interface IInsightsProps {
  context: WebPartContext;
}

export interface IDashboardAsset {
  id: string;
  title: string;
  uploaded: string;
  status: string;
  isInCollection: boolean;
}

export interface IPipelineStage {
  name: string;
  count: string | number;
  fillClass: string;
}

export interface IPipelineCardProps {
  title: string;
  subtitle: string;
  stages: IPipelineStage[];
}

export interface IAssetSectionProps {
  context: WebPartContext;
  title: string;
  subtitle: string;
  userRole: UserRole;
}

export interface ITaskSectionProps {
  title: string;
  subtitle: string;
  editorTasks?: boolean;
}

export interface IAssetsPageState {
  searchTerm: string;
}
