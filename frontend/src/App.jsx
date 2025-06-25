import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Check,
  X,
  ListTodo,
  Trash2,
  RefreshCw,
} from "lucide-react";

const backendURL = "https://todo-backend-ve5i.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(backendURL);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault(); 
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(backendURL, { title, completed: false });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle task completion status
  const toggleTask = async (id) => {
    try {
      await axios.put(`${backendURL}/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to update task.");
      console.error(err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${backendURL}/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Todo List
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Organize your life, one task at a time</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500">
            <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-center">
            <X className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-800 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={addTask} className="flex gap-4 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Add Task
          </button>
        </form>

        {/* Refresh */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <ListTodo className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 transition ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300"
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <h3
                  className={`flex-1 text-lg font-medium ${
                    task.completed ? "text-gray-500 line-through" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.completed ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
