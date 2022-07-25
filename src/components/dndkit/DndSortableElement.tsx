import { ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useHovered from "^hooks/useHovered";
import tw, { css } from "twin.macro";
import { DotsSixVertical } from "phosphor-react";
import s_transition from "^styles/transition";
import WithTooltip from "^components/WithTooltip";

const DndSortableElement = ({
  isDisabled = false,
  children,
  elementId,
  colSpan,
  handlePos = "in",
}: {
  children: ReactElement;
  elementId: string;
  isDisabled?: boolean;
  colSpan?: number;
  handlePos?: "in" | "out";
}): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: elementId, disabled: isDisabled });
  const [grabHandleIsHovered, handlehoverHandlers] = useHovered();
  const [containerIsHovered, containerHoverHandlers] = useHovered();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handlePosStyle =
    handlePos === "out" ? tw`right-0 translate-x-full` : tw`right-1`;

  return (
    <div
      css={[
        tw`relative z-20`,
        colSpan && s_container(colSpan),
        (grabHandleIsHovered || isDragging) && tw`opacity-70`,
        tw`transition-opacity ease-in-out duration-75 hover:z-40`,
      ]}
      style={style}
      ref={setNodeRef}
      {...containerHoverHandlers}
    >
      {children}
      <div
        css={[
          tw`absolute top-1/2 z-30 -translate-y-1/2 rounded-sm py-1`,
          handlePosStyle,
          grabHandleIsHovered && tw`bg-white`,
          s_transition.toggleVisiblity(containerIsHovered),
        ]}
      >
        <WithTooltip text="drag to change order" isDisabled={isDragging}>
          <button
            css={[tw`text-2xl`]}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            type="button"
            {...attributes}
            {...listeners}
            {...handlehoverHandlers}
          >
            <DotsSixVertical />
          </button>
        </WithTooltip>
      </div>
    </div>
  );
};

export default DndSortableElement;

const s_container = (width: number) =>
  css`
    ${width === 1
      ? tw`col-span-1`
      : width === 2
      ? tw`col-span-2`
      : tw`col-span-3`}
  `;
