import { useRef, useMemo, useEffect, MutableRefObject } from 'react';
import { MetaTagsConfig, MetaTagModel } from './types';
import {
  parseMetaConfig,
  subscribeToStore,
  addMetasToStore,
  removeMetasFromStore,
} from './state';
import { updateDom } from './render/dom';

// Subscribes to store changes and update DOM
subscribeToStore((metas) => updateDom(metas, 50));

// NOTE: Decided to use useRef and useMemo rather than useEffect to save the meta configs,
// since useEffect functions are exectured starting from the inner children up to the root
// and I want the inner children's metas to override the parent's ones
const useMetaTags = (config: MetaTagsConfig, dependsOn: unknown[]) => {
  const instanceConfig = useRef<MetaTagModel>();
  const metas = useMemo(() => parseMetaConfig(config), dependsOn);
  useEffect(() => {
    // On component unmount its config is removed from the state
    return () => {
      instanceConfig.current &&
        removeMetasFromStore(instanceConfig as MutableRefObject<MetaTagModel>);
    };
  }, []);
  if (instanceConfig.current !== metas) {
    instanceConfig.current = metas;
    instanceConfig.current &&
      addMetasToStore(instanceConfig as MutableRefObject<MetaTagModel>);
  }
};

export default useMetaTags;
