import { ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useHovered from "^hooks/useHovered";
import tw, { css } from "twin.macro";
import { DotsSixVertical } from "phosphor-react";

const DndSortableElement = ({
  isDisabled = false,
  children,
  elementId,
  colSpan,
}: {
  children: ReactElement;
  elementId: string;
  isDisabled?: boolean;
  colSpan: number;
}): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: elementId, disabled: isDisabled });
  const [grabHandleIsHovered, hoverHandlers] = useHovered();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      css={[
        tw`relative `,
        s_container(colSpan),
        (grabHandleIsHovered || isDragging) && tw`opacity-70`,
        tw`transition-opacity ease-in-out duration-75`,
      ]}
      style={style}
      ref={setNodeRef}
    >
      {children}
      <div
        css={[
          tw`absolute right-1 top-1/2 z-30 -translate-y-1/2 rounded-sm py-1`,
          grabHandleIsHovered && tw`bg-white`,
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
          {...hoverHandlers}
        >
          <DotsSixVertical />
        </button>
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
