import * as React from 'react';
import styles from '../../DigitalAssets.module.scss';
import type { ITaskSectionProps } from '../../IDigitalAssetsProps';

interface IDashboardTask {
  id: string;
  title: string;
  studio: string;
  folder: string;
  due: string;
  taskType: string;
  priority: string;
  assignee: string;
  status: string;
}

const TASKS: IDashboardTask[] = [
  {
    id: 'task-runner',
    title: 'Studio Runner — Packshot final pass',
    studio: 'Portugal',
    folder: 'StudioRunner_Packshot',
    due: '2026-11-03',
    taskType: 'MAIN and OUTSIDE',
    priority: 'Urgent',
    assignee: 'Emma Jørgensen',
    status: 'Ready for Review'
  },
  {
    id: 'task-momentum',
    title: 'Momentum Knit — Lifestyle set 03',
    studio: 'India',
    folder: 'MomentumKnit_Lifestyle03',
    due: '2026-11-05',
    taskType: 'ALL STATICS and SPIN',
    priority: 'Important',
    assignee: 'Anders Møller',
    status: 'In Edit'
  },
  {
    id: 'task-coastal',
    title: 'Coastal Slide — Sandal colorways',
    studio: 'Portugal',
    folder: 'CoastalSlide_Sandals',
    due: '2026-11-08',
    taskType: 'PAIRS - 3 angles',
    priority: 'Low',
    assignee: 'Unassigned',
    status: 'Ready to Edit'
  },
  {
    id: 'task-harbor',
    title: 'Harbor Trainer — Studio hero shots',
    studio: 'Portugal',
    folder: 'HarborTrainer_Hero',
    due: '2026-11-10',
    taskType: 'SPIN',
    priority: 'Medium',
    assignee: 'Freja Nielsen',
    status: 'Edited'
  }
];

interface ITaskSectionState {
  activeTab: string;
  search: string;
  studio: string;
  priority: string;
  taskType: string;
  dueFrom: string;
  dueTo: string;
}

export default class TaskSection extends React.Component<ITaskSectionProps, ITaskSectionState> {
  public state: ITaskSectionState = {
    activeTab: 'My Tasks',
    search: '',
    studio: '',
    priority: '',
    taskType: '',
    dueFrom: '',
    dueTo: ''
  };

  private handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ search: event.currentTarget.value });
  private handleStudio = (event: React.ChangeEvent<HTMLSelectElement>): void =>
    this.setState({ studio: event.currentTarget.value });
  private handlePriority = (event: React.ChangeEvent<HTMLSelectElement>): void =>
    this.setState({ priority: event.currentTarget.value });
  private handleTaskType = (event: React.ChangeEvent<HTMLSelectElement>): void =>
    this.setState({ taskType: event.currentTarget.value });
  private handleDueFrom = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ dueFrom: event.currentTarget.value });
  private handleDueTo = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ dueTo: event.currentTarget.value });

  public render(): React.ReactElement {
    const { props } = this;
    const { activeTab, search, studio, priority, taskType, dueFrom, dueTo } = this.state;
    const visibleTasks = TASKS.filter(task => {
      const searchText = props.editorTasks
        ? `${task.title} ${task.studio} ${task.folder}`
        : `${task.title} ${task.studio} ${task.folder} ${task.assignee}`;
      const matchesSearch = searchText.toLowerCase().indexOf(search.trim().toLowerCase()) !== -1;
      const matchesStudio = !studio || task.studio === studio;
      const matchesPriority = !priority || task.priority === priority;
      const matchesTaskType = !taskType || task.taskType === taskType;
      const matchesDueFrom = !dueFrom || task.due >= dueFrom;
      const matchesDueTo = !dueTo || task.due <= dueTo;
      const matchesTab = props.editorTasks ||
        activeTab === 'My Tasks' ||
        (activeTab === 'New Assignment' && task.assignee === 'Unassigned') ||
        (activeTab === 'Reassignment' && task.assignee !== 'Unassigned');
      return matchesSearch && matchesStudio && matchesPriority && matchesTaskType &&
        matchesDueFrom && matchesDueTo && matchesTab;
    });

    return (
      <section className={`${styles.dashboardCard} ${styles.taskSection}`}>
        <div className={styles.dashboardSectionHeader}>
          <div>
            <h2>{props.title}</h2>
            <p>{props.subtitle}</p>
          </div>
          <label className={styles.dashboardSearchLabel}>
            <span className={styles.visuallyHidden}>Search tasks</span>
            <input
              className={styles.dashboardSearch}
              type="search"
              placeholder={props.editorTasks ? 'Search title, studio or folder' : 'Search tasks or assignees'}
              value={search}
              onChange={this.handleSearch}
            />
          </label>
        </div>
        {!props.editorTasks && (
          <div className={styles.assetToolbar}>
            <div className={styles.dashboardTabs} role="tablist" aria-label="Task management views">
              {['My Tasks', 'New Assignment', 'Reassignment'].map(tab => (
                <button
                  className={`${styles.dashboardTab} ${activeTab === tab ? styles.activeDashboardTab : ''}`}
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => this.setState({ activeTab: tab })}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}
        {props.editorTasks && (
          <div className={styles.filterPanel}>
            <label>
              Studio
              <select value={studio} onChange={this.handleStudio}>
                <option value="">All studios</option>
                <option value="Thailand">Thailand</option>
                <option value="Portugal">Portugal</option>
                <option value="India">India</option>
              </select>
            </label>
            <label>
              Priority
              <select value={priority} onChange={this.handlePriority}>
                <option value="">All priorities</option>
                <option>Urgent</option>
                <option>Important</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <label>
              Task type
              <select value={taskType} onChange={this.handleTaskType}>
                <option value="">All task types</option>
                <option>MAIN and OUTSIDE</option>
                <option>ALL STATICS and SPIN</option>
                <option>PAIRS - 3 angles</option>
                <option>SPIN</option>
              </select>
            </label>
            <label>
              Due from
              <input type="date" value={dueFrom} onChange={this.handleDueFrom} />
            </label>
            <label>
              Due to
              <input type="date" value={dueTo} onChange={this.handleDueTo} />
            </label>
          </div>
        )}
        <div className={styles.dashboardList}>
          {visibleTasks.map(task => (
            <article className={styles.dashboardListRow} key={task.id}>
              <span className={styles.taskIcon} aria-hidden="true">✓</span>
              <div className={styles.dashboardRowMain}>
                <strong>{task.title}</strong>
                <span>
                  Studio: {task.studio} · Due {task.due} · {task.taskType}
                </span>
              </div>
              <span className={styles.statusBadge}>{task.status}</span>
              <span className={styles.collectionStatus}>
                {props.editorTasks ? task.priority : task.assignee}
              </span>
            </article>
          ))}
          {visibleTasks.length === 0 && (
            <p className={styles.emptyDashboard}>No tasks match your search or filters.</p>
          )}
        </div>
      </section>
    );
  }
}
