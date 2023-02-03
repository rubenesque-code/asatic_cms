import { useEffect } from "react";
import produce from "immer";
import { Editor } from "@tiptap/react";
import { Footnote } from "^types/article-like-entity";
import { arrayDivergence, mapIds } from "^helpers/general";

type EditorFootnoteNode = {
  type: "footnote";
  attrs: { id: string; number: number };
};

// · Control footnotes by adding and deleting within editor · don't control by footnote text entities themselves; otherwise, get into complications with editor undo

const useUpdateFootnotesTextOnEditorFootnotesNumsChange = (
  editor: Editor,
  footnotesText?: {
    entities: Footnote[];
    deleteFootnote: (id: string) => void;
    addFootnote: (id: string, num: number) => void;
    updateFootnoteNum: (id: string, num: number) => void;
  }
) => {
  useEffect(() => {
    if (!footnotesText) {
      return;
    }
    // · add/delete footnote text entity in unison with editor footnote nums

    const editorFootnotesNums = (editor
      .getJSON()
      .content?.filter((content) => content.content)
      .flatMap((content) => content.content)
      .flatMap((node) => (node?.type === "footnote" ? [node] : [])) ||
      []) as EditorFootnoteNode[];

    /*     if (editorFootnotesNums?.length === footnotesText.entities.length) {
      return;
    } */

    const editorFootnoteIds = editorFootnotesNums?.flatMap((node) =>
      node.attrs?.id ? (node.attrs.id as string) : []
    );

    if (editorFootnotesNums?.length < footnotesText.entities.length) {
      // ·  delete corresponding footnote(s) text (after editor footnote deleted)

      const footnoteTextsIdsWithoutEditorFootnoteNum = arrayDivergence(
        mapIds(footnotesText.entities),
        editorFootnoteIds
      );

      footnoteTextsIdsWithoutEditorFootnoteNum.forEach((id) => {
        footnotesText.deleteFootnote(id);
      });

      return;
    }

    if (editorFootnotesNums?.length > footnotesText.entities.length) {
      // · add corresponding footnote(s) text
      const editorFootnoteNumsIdsWithoutFootnoteText = arrayDivergence(
        editorFootnoteIds,
        mapIds(footnotesText.entities)
      );

      editorFootnoteNumsIdsWithoutFootnoteText.forEach((footnoteNumId) => {
        const editorFootnote = editorFootnotesNums.find(
          (editorFootnoteNum) => editorFootnoteNum.attrs.id === footnoteNumId
        )!;
        footnotesText.addFootnote(
          editorFootnote.attrs.id,
          editorFootnote.attrs.number
        );
      });

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.getJSON()]);

  useEffect(() => {
    if (!footnotesText?.entities.length) {
      return;
    }
    // · order footnoteNum numbers: when footnote added before another, deleted, etc.

    const editorFootnotesNums = (editor
      .getJSON()
      .content?.filter((content) => content.content)
      .flatMap((content) => content.content)
      .flatMap((node) => (node?.type === "footnote" ? [node] : [])) ||
      []) as EditorFootnoteNode[];

    if (!editorFootnotesNums?.length) {
      return;
    }

    let isInOrder = true;

    for (let i = 0; i < editorFootnotesNums.length; i++) {
      const footnote = editorFootnotesNums[i];
      if (footnote?.attrs?.number !== i + 1) {
        isInOrder = false;
        break;
      }
    }

    if (isInOrder) {
      return;
    }

    const updatedEditorContent = produce(editor.getJSON(), (draft) => {
      if (!draft.content) {
        return;
      }
      for (let i = 0; i < draft.content.length; i++) {
        const paragraphNode = draft.content[i];
        if (!paragraphNode.content) {
          continue;
        }

        const footnoteNodes = paragraphNode.content.flatMap((node) =>
          node.type === "footnote" ? [node] : []
        );

        for (let j = 0; j < footnoteNodes.length; j++) {
          const node = footnoteNodes[j];

          if (node.attrs?.number === j + 1) {
            continue;
          }
          node.attrs = {
            id: node.attrs!.id,
            number: j + 1,
          };
          footnotesText.updateFootnoteNum(node.attrs.id, j + 1);
        }
      }
    });

    editor.commands.setContent(updatedEditorContent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.getJSON()]);
};

export default useUpdateFootnotesTextOnEditorFootnotesNumsChange;
