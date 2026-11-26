import * as React from 'react';
import * as strings from 'DigitalAssetsWebPartStrings';
import styles from '../DigitalAssets.module.scss';
import type { IDashboardProps } from '../IDigitalAssetsProps';
import AssetSection from './dashboard/AssetSection';
import Insights from './dashboard/Insights';
import TaskSection from './dashboard/TaskSection';

export default class Dashboard extends React.Component<IDashboardProps> {
  public render(): React.ReactElement {
    const { props } = this;

    if (props.roleError) {
      return (
        <div className={styles.roleAlert} role="alert">
          <h1>Dashboard unavailable</h1>
          <p>{props.roleError}</p>
        </div>
      );
    }

    if (!props.role) {
      return (
        <div className={styles.roleAlert} role="status">
          <h1>No Digital Assets role found</h1>
          <p>Your account is not a member of a configured Digital Assets role group or the site’s default Readers group.</p>
        </div>
      );
    }

    const isStudio = props.role === 'studio';
    const isAssetCoordinator = props.role === 'assetCoordinator';
    const hasAssets = ['assetCoordinator', 'categoryManager', 'reader', 'administrator'].indexOf(props.role) !== -1;

    return (
      <div className={styles.dashboard}>

        <Insights context={props.context} />

        {isStudio && (
          <AssetSection
            context={props.context}
            title={strings.MyAssetsTitle}
            subtitle={strings.MyAssetsSubtitle}
            userRole={props.role}
          />
        )}

        {hasAssets && (
          <AssetSection
            context={props.context}
            title={strings.AssetsTitle}
            subtitle={strings.AssetsSubtitle}
            userRole={props.role}
          />
        )}

        {isAssetCoordinator && (
          <TaskSection
            title="Task management"
            subtitle="Review, assign and reassign tasks to team members"
          />
        )}

        {props.role === 'editor' && (
          <TaskSection
            title="Tasks"
            subtitle="Tasks assigned to you by the Asset Coordinator"
            editorTasks={true}
          />
        )}
      </div>
    );
  }
}
