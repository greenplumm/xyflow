import { onMounted, ref } from 'vue';
import { errorMessages } from '@xyflow/system';
import { useStoreApi } from '../../hooks/useStore';

export default function useStylesLoadedWarning() {
  const store = useStoreApi();
  const checked = ref(false);

  onMounted(() => {
    if (import.meta.env.MODE === 'development') {
      if (!checked.value) {
        const pane = document.querySelector('.react-flow__pane');
        if (pane && !(window.getComputedStyle(pane).zIndex === '1')) {
          store.getState().onError?.('013', errorMessages['error013']('vue'));
        }
        checked.value = true;
      }
    }
  });
}