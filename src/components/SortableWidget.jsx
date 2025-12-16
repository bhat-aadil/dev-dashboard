import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WidgetWrapper from "./WidgetWrapper";

export default function SortableWidget({ id, title, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <WidgetWrapper
        title={title}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {children}
      </WidgetWrapper>
    </div>
  );
}
