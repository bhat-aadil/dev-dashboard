export default function WidgetWrapper({ title, children, dragHandleProps }) {
  return (
    <div className="rounded-lg bg-gray-900 h-[400px] flex flex-col  shadow-sm shadow-gray-400">
      {/* Header: drag handle */}
      <div
        {...(dragHandleProps || {})}
        className="widget-header flex items-center justify-between px-4 py-2  cursor-move select-none bg-gray-800 rounded"
      >
        <h3 className="text-lg text-gray-300 font-bold">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-4 overflow-auto">{children}</div>
    </div>
  );
}
