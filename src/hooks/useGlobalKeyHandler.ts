import { useEffect } from 'react';

import { useStore, useStoreActions } from '../store/hooks';
import useKeyPress from './useKeyPress';
import { isNode, getConnectedEdges } from '../utils/graph';
import { Elements, KeyCode } from '../types';

interface HookParams {
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
  onElementsRemove?: (elements: Elements) => void;
}

export default ({ deleteKeyCode, multiSelectionKeyCode, onElementsRemove }: HookParams): void => {
  const store = useStore();

  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const setMultiSelectionActive = useStoreActions((actions) => actions.setMultiSelectionActive);
  const resetSelectedElements = useStoreActions((actions) => actions.resetSelectedElements);

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    const { edges, selectedElements } = store.getState();
    if (onElementsRemove && deleteKeyPressed && selectedElements) {
      let elementsToRemove = selectedElements;

      // we also want to remove the edges if only one node is selected
      if (selectedElements.length === 1 && isNode(selectedElements[0])) {
        const node = selectedElements[0];
        const connectedEdges = getConnectedEdges([node], edges);
        elementsToRemove = [...selectedElements, ...connectedEdges];
      }

      onElementsRemove(elementsToRemove);
      unsetNodesSelection();
      resetSelectedElements();
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    setMultiSelectionActive(multiSelectionKeyPressed);
  }, [multiSelectionKeyPressed]);
};
