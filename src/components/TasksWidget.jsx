import { useEffect, useState } from "react";
import { format, isPast, differenceInMinutes } from "date-fns";

const STORAGE_KEY = "devdash-tasks-v2";
function scheduleReminderNotification(task) {
  // if deadline > now and within next minute, show now.
  try {
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;
    const mins = differenceInMinutes(new Date(task.deadline), new Date());
    if (mins <= 0 && !task.notified) {
      new Notification(`Task overdue: ${task.text}`);
      return true;
    }
    if (mins > 0 && mins <= 1 && !task.notified) {
      // notify soon
      new Notification(`Task due soon: ${task.text} (in ${mins} min)`);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export default function TasksWidget() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // check deadlines every 30 seconds
    const timer = setInterval(() => {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.deadline && !t.notified) {
            const didNotify = scheduleReminderNotification(t);
            if (didNotify) return { ...t, notified: true };
          }
          return t;
        });
        return updated;
      });
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (!text.trim()) return;
    const t = {
      id: Date.now(),
      text: text.trim(),
      done: false,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      notified: false,
    };
    setTasks((prev) => [t, ...prev]);
    setText("");
    setDeadline("");
  };

  const toggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const overdue = (t) =>
    t.deadline ? isPast(new Date(t.deadline)) && !t.done : false;

  return (
    <div className="p-4 bg-gray-800 text-gray-300 rounded-2xl shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Tasks & Reminders</h3>
        <div className="text-xs text-slate-300">Deadlines & notifications</div>
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
          className="flex-1 px-2 py-1 border rounded bg-gray-900"
        />

        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          type="datetime-local"
          className="px-2 py-1 border rounded bg-gray-900"
        />

        <button
          onClick={addTask}
          className="px-3 py-1 bg-gray-900 border hover:bg-gray-800 text-white rounded cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="overflow-auto">
        <ul className="space-y-2">
          {tasks
            .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))
            .map((t) => (
              <li
                key={t.id}
                className={`p-2 text-white border rounded flex items-center justify-between ${
                  overdue(t) ? "bg-red-900/40" : ""
                }`}
              >
                <div>
                  <label
                    className={`cursor-pointer ${
                      t.done ? "line-through text-slate-400" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggle(t.id)}
                      className="mr-2"
                    />{" "}
                    {t.text}
                  </label>
                  {t.deadline && (
                    <div className="text-xs text-slate-300">
                      Due: {format(new Date(t.deadline), "PPpp")}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-slate-400">
                    {t.notified ? "Notified" : ""}
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    className="text-xs text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          {tasks.length === 0 && (
            <li className="text-sm text-slate-500">No tasks yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
