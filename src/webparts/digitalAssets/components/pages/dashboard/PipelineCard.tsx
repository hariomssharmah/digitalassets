import * as React from 'react';
import styles from '../../DigitalAssets.module.scss';
import type { IPipelineCardProps } from '../../IDigitalAssetsProps';

export default class PipelineCard extends React.Component<IPipelineCardProps> {
  public render(): React.ReactElement {
    const { title, subtitle, stages } = this.props;
    return (
      <article className={`${styles.dashboardCard} ${styles.pipelineCard}`}>
        <div className={styles.dashboardSectionHeader}>
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className={styles.pipelineStages}>
          {stages.map(stage => (
            <div className={styles.pipelineStage} key={stage.name}>
              <span className={styles.pipelineStageName}>{stage.name}</span>
              <strong className={styles.pipelineStageCount}>{stage.count}</strong>
              <span className={styles.pipelineBar} aria-hidden="true">
                <span className={stage.fillClass} />
              </span>
            </div>
          ))}
        </div>
      </article>
    );
  }
}
