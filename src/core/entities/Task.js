export class Task {
  /**
   * @param {string} id - Unique identifier
   * @param {string} title - Task title
   * @param {string} description - Task description
   * @param {'todo' | 'in-progress' | 'done'} status - Current status of the task
   */
  constructor(id, title, description, status = 'todo') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
