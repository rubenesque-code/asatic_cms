import { ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useHovered from "^hooks/useHovered";
import tw from "twin.macro";

const DndSortableElement = ({
  isDisabled = false,
  children,
  elementId,
}: {
  children: ReactElement;
  elementId: string;
  isDisabled?: boolean;
}): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: elementId, disabled: isDisabled });
  const [isHovered, hoverHandlers] = useHovered();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      css={[isHovered && tw`opacity-70`]}
      style={style}
      ref={setNodeRef}
      {...hoverHandlers}
    >
      {/* <div className="relative h-full bg-white"> */}
      {children}
      {/*         <div
          className={`z-30 absolute right-1 top-1/2 -translate-y-1/2 rounded-sm py-1 ${
            isHovered && 'bg-white'
          }`}
        >
          <DragHandleDots2Icon
            className="w-5 h-5 "
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            {...attributes}
            {...listeners}
          />
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default DndSortableElement;

const DragHandlse = () => <div></div>;
