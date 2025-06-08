import { ref, watchEffect, computed } from 'vue';
import { isInputDOMNode, type KeyCode } from '@xyflow/system';

type Keys = Array<string>;
type PressedKeys = Set<string>;
type KeyOrCode = 'key' | 'code';

export type UseKeyPressOptions = {
  target?: Window | Document | HTMLElement | ShadowRoot | null;
  actInsideInputWithModifier?: boolean;
};

const defaultDoc = typeof document !== 'undefined' ? document : null;

/**
 * This hook lets you listen for specific key codes and tells you whether they are
 * currently pressed or not.
 *
 * @public
 * @param keyCode - The key code (string or array of strings) to use
 * @param options - Options
 * @returns boolean
 *
 * @example
 * ```ts
 *import { useKeyPress } from '@xyflow/vue';
 *
 *const spacePressed = useKeyPress('Space');
 *const cmdAndSPressed = useKeyPress(['Meta+s', 'Strg+s']);
 *```
 */
export function useKeyPress(
  keyCode: KeyCode | null = null,
  options: UseKeyPressOptions = { target: defaultDoc, actInsideInputWithModifier: true }
) {
  const keyPressed = ref(false);
  const modifierPressed = ref(false);
  const pressedKeys = ref<PressedKeys>(new Set([]));

  const { keyCodes, keysToWatch } = computed(() => {
    if (keyCode !== null) {
      const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      const keys = keyCodeArr
        .filter((kc) => typeof kc === 'string')
        .map((kc) => kc.replace('+', '\n').replace('\n\n', '\n+').split('\n'));
      const keysFlat = keys.reduce((res: Keys, item) => res.concat(...item), []);

      return { keyCodes: keys, keysToWatch: keysFlat };
    }

    return { keyCodes: [], keysToWatch: [] };
  });

  const downHandler = (event: KeyboardEvent) => {
    modifierPressed.value = event.ctrlKey || event.metaKey || event.shiftKey;
    const preventAction =
      (!modifierPressed.value || (modifierPressed.value && !options.actInsideInputWithModifier)) &&
      isInputDOMNode(event);

    if (preventAction) {
      return false;
    }
    const keyOrCode = useKeyOrCode(event.code, keysToWatch.value);
    pressedKeys.value.add(event[keyOrCode]);

    if (isMatchingKey(keyCodes.value, pressedKeys.value, false)) {
      event.preventDefault();
      keyPressed.value = true;
    }
  };

  const upHandler = (event: KeyboardEvent) => {
    const preventAction =
      (!modifierPressed.value || (modifierPressed.value && !options.actInsideInputWithModifier)) &&
      isInputDOMNode(event);

    if (preventAction) {
      return false;
    }
    const keyOrCode = useKeyOrCode(event.code, keysToWatch.value);

    if (isMatchingKey(keyCodes.value, pressedKeys.value, true)) {
      keyPressed.value = false;
      pressedKeys.value.clear();
    } else {
      pressedKeys.value.delete(event[keyOrCode]);
    }

    if (event.key === 'Meta') {
      pressedKeys.value.clear();
    }

    modifierPressed.value = false;
  };

  const resetHandler = () => {
    pressedKeys.value.clear();
    keyPressed.value = false;
  };

  watchEffect((onCleanup) => {
    const target = options?.target || defaultDoc;

    if (keyCode !== null) {
      target?.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
      target?.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
      window.addEventListener('blur', resetHandler);
      window.addEventListener('contextmenu', resetHandler);

      onCleanup(() => {
        target?.removeEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
        target?.removeEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
        window.removeEventListener('blur', resetHandler);
        window.removeEventListener('contextmenu', resetHandler);
      });
    }
  });

  return keyPressed;
}

function isMatchingKey(keyCodes: Array<Keys>, pressedKeys: PressedKeys, isUp: boolean): boolean {
  return (
    keyCodes
      .filter((keys) => isUp || keys.length === pressedKeys.size)
      .some((keys) => keys.every((k) => pressedKeys.has(k)))
  );
}

function useKeyOrCode(eventCode: string, keysToWatch: KeyCode): KeyOrCode {
  return keysToWatch.includes(eventCode) ? 'code' : 'key';
}