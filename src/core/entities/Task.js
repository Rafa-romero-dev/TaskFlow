export class Task {
  /**
   * @param {string} id - Unique identifier
   * @param {string} title - Task title
   * @param {string} description - Task description
   * @param {'pending' | 'in-progress' | 'completed'} status - Current status of the task
   */
  constructor(id, title, description, status = 'pending') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
