import { ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  MouseSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  // verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

const DndSortableContext = ({
  children,
  elementIds,
  onReorder: onDragReorder,
}: {
  children: ReactElement[];
  elementIds: string[];
  onReorder: ({
    activeId,
    overId,
  }: {
    activeId: string;
    overId: string;
  }) => void;
}) => {
  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);

  const handleDragReorder = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over) {
      const activeId = active.id as string;
      const overId = over.id as string;

      onDragReorder({ activeId, overId });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragReorder}
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext items={elementIds} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DndSortableContext;
