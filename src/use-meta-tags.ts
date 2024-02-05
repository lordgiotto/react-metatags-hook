import { useRef, useEffect } from 'react';
import { MetaTagsConfig } from './types';
import { metaTagsStore, parseMetaConfig } from './state';
import { updateDom } from './render/dom';

// Subscribes to store changes and update DOM
metaTagsStore.subscribe((metas) => updateDom(metas, 50));

// NOTE: useEffects runs from the inner component up to the root, but we want metatags
// to be merged with a logic of letast rendered components to "win" over the previous ones.
// So the idea is:
//  - when a component mounts for the first time we define a unique ID and timestamp for each
//    "instance" of its useMetaTags usage
//  - in a useEffect we "register" this instance in the store using the id and the timestams:
//    even if the useEffects will run with another order (from the inner to the outer component),
//    the timestamp we generated at the first render of the component will be used to merged
//    meta tags definitions in the correct order
//  - everytime a dependency changes, the meta tags config used to replace the meta tags
//    definitions in the registered "instance" in the store
//  - When a component is unmounted, the instance is deregistered from the store, and its
//    meta tags are removed from the result of the final merge
export const useMetaTags = (
  config: MetaTagsConfig,
  dependencies: unknown[]
) => {
  const hookInstanceId = useRef(Symbol());
  const hookInstanceTs = useRef(Date.now());
  // NOTE: When running on the server, effects doesn't run, so here
  // metatags are saved within the render function
  if (typeof window === 'undefined') {
    metaTagsStore.registerInstance(
      hookInstanceId.current,
      hookInstanceTs.current
    );
    metaTagsStore.setInstanceMetaTags(
      hookInstanceId.current,
      parseMetaConfig(config)
    );
  }
  useEffect(() => {
    const deregisterInstance = metaTagsStore.registerInstance(
      hookInstanceId.current,
      hookInstanceTs.current
    );
    return () => {
      deregisterInstance();
    };
  }, []);
  useEffect(() => {
    const newMetaTagsModel = parseMetaConfig(config);
    metaTagsStore.setInstanceMetaTags(hookInstanceId.current, newMetaTagsModel);
    // NOTE: we want to regenerate the meta tags only when the explicit dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencies]);
};

/**
 * @deprecated Do not use the default export from 'react-metatags-hook', it will be removed in a future release.
 *
 * Please use the named export `useMetaTags`.
 *
 * e.g. `import { useMetaTags } from 'react-metatags-hook'`
 */
export default (config: MetaTagsConfig, dependencies: unknown[]) => {
  useMetaTags(config, dependencies);
};
