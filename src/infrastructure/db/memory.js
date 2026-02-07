export const tasks = [];
export let idCounter = 1;

export const resetTasks = () => {
    while (tasks.length > 0) {
        tasks.pop();
    }
    idCounter = 1;
}

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
