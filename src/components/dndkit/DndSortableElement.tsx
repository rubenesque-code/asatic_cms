import { ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useHovered from "^hooks/useHovered";
import tw from "twin.macro";
import { DotsSixVertical } from "phosphor-react";

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
      css={[tw`relative`, isHovered && tw`opacity-70`]}
      style={style}
      ref={setNodeRef}
      {...hoverHandlers}
    >
      {children}
      <div
        css={[
          tw`absolute right-1 top-1/2 z-30 -translate-y-1/2 rounded-sm py-1`,
          isHovered && tw`bg-white`,
        ]}
      >
        <button
          css={[tw`text-2xl`]}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          type="button"
          {...attributes}
          {...listeners}
        >
          <DotsSixVertical />
        </button>
      </div>
    </div>
  );
};

export default DndSortableElement;
