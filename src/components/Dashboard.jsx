import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import SortableWidget from "./SortableWidget";
import { availableWidgets } from "../widgets"; // registry of extra widgets

import SearchWidget from "./SearchWidget";
import VoiceWidget from "./VoiceWidget";
import AIChatWidget from "./AIChatWidget";

import {
  Search as IconSearch,
  Mic as IconMic,
  MessageCircle as IconChat,
  CloudSun,
  StickyNote,
  Calendar as IconCalendar,
  CheckSquare,
  Newspaper,
  Code2,
  Moon,
  Sun,
  Clock,
  LineChart,
  Quote,
  Timer,
  BracesIcon,
  Briefcase,
  Code,
  BitcoinIcon,
  LayoutGrid,
  Blocks,
} from "lucide-react";

const DEFAULT_WIDGETS = ["Search", "Voice Assistant", "AI Assistant"];

export default function Dashboard() {
  const [activeWidgets, setActiveWidgets] = useState(DEFAULT_WIDGETS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Map names to components
  const widgetMap = {
    "AI Assistant": AIChatWidget,
    Search: SearchWidget,
    "Voice Assistant": VoiceWidget,
    ...availableWidgets,
  };

  // Sidebar icons
  const iconMap = {
    Search: <IconSearch size={18} />,
    "Voice Assistant": <IconMic size={18} />,
    "AI Assistant": <IconChat size={18} />,
    Weather: <CloudSun size={18} />,
    Notes: <StickyNote size={18} />,
    Calendar: <IconCalendar size={18} />,
    Tasks: <CheckSquare size={18} />,
    News: <Newspaper size={18} />,
    "Stack Overflow": <BracesIcon size={18} />,
    "World Clock": <Clock size={18} />,
    Stocks: <LineChart size={18} />,
    Crypto: <BitcoinIcon size={18} />,
    Quotes: <Quote size={18} />,
    Interview: <Briefcase size={18} />,
    Pomodoro: <Timer size={18} />,
    GitHub: <Code size={18} />,
  };

  // sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // load saved order
  useEffect(() => {
    const saved = localStorage.getItem("dashboard_active_widgets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((w) => widgetMap[w]);

          if (filtered.length) {
            setActiveWidgets(filtered);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  // persist order
  useEffect(() => {
    localStorage.setItem(
      "dashboard_active_widgets",
      JSON.stringify(activeWidgets)
    );
  }, [activeWidgets]);

  // toggle add/remove widget
  const toggleWidget = useCallback((name) => {
    setActiveWidgets((prev) => {
      if (prev.includes(name)) return prev.filter((w) => w !== name);
      return [...prev, name];
    });
  }, []);

  // reset layout
  const resetDashboard = useCallback(() => {
    setActiveWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem("dashboard_active_widgets");
  }, []);

  // handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeWidgets.indexOf(active.id);
    const newIndex = activeWidgets.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setActiveWidgets((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-gray-950 text-white transition-all duration-200 overflow-hidden shadow-lg shadow-gray-400 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-3 flex flex-col h-full">
          <button
            onClick={() => setIsSidebarOpen((s) => !s)}
            className="mb-4 flex text-white items-center  justify-center px-2 py-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            {isSidebarOpen ? "⬅ Collapse" : "➡"}
          </button>

          <h3
            className={`text-lg font-bold mb-3 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            📂 Widgets
          </h3>

          <div className="flex-1 overflow-auto">
            <ul className="space-y-2">
              {Object.keys(widgetMap).map((name) => {
                const active = activeWidgets.includes(name);
                return (
                  <li
                    key={name}
                    onClick={() => toggleWidget(name)}
                    className={`flex items-center justify-center md:justify-start gap-3 p-2 rounded cursor-pointer select-none transition-colors ${
                      active ? "bg-black" : "hover:bg-gray-800"
                    } `}
                  >
                    <span>{iconMap[name] ?? <Code2 size={18} />}</span>
                    {isSidebarOpen && <span className="truncate">{name}</span>}
                    {isSidebarOpen && active && (
                      <span className="ml-auto text-xs text-green-200">
                        Added
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={resetDashboard}
              className={`flex items-center justify-center rounded transition-colors ${
                isSidebarOpen
                  ? "w-full px-3 py-2 bg-gray-800 rounded hover:bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700 w-10 h-10 mx-auto rounded-full"
              }`}
            >
              {isSidebarOpen ? "🔄 Reset Layout" : "🔄"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`absolute top-0 flex-1 ml-16 p-6 transition-all duration-200  bg-gray-950
         ${isSidebarOpen ? "w-3/4" : "w-[90%]"}
        ${isSidebarOpen ? "md:ml-64" : "md:ml-24"}
      `}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100">
            Developer Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag the header to reorder. Add/remove widgets from the sidebar.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={activeWidgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeWidgets.map((widgetName) => {
                const WidgetComponent = widgetMap[widgetName];
                return (
                  <SortableWidget
                    key={widgetName}
                    id={widgetName}
                    title={widgetName}
                  >
                    <div className="min-h-[180px] md:min-h-[220px] lg:min-h-[260px]">
                      {WidgetComponent ? (
                        <WidgetComponent />
                      ) : (
                        <div className="text-sm text-gray-500 p-4">
                          Widget not found
                        </div>
                      )}
                    </div>
                  </SortableWidget>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </>
  );
}
