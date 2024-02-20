import { inject, observer } from 'mobx-react';
import { useEffect } from 'react'
import { push } from '../../navigation/RootNavigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { env } from '../../config'

const DynamicLinkHandler = (props) => {

  // Background/quit events
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url.includes(env.SHARE_WEBAPP)) {
            handleDynamicLink(link); 
        }
      });
  }, []);

  // Foreground events
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(link => {
        handleDynamicLink(link);   
    });
    return () => unsubscribe();
  }, []);
  

  async function handleDynamicLink(link) {  
    let hashId = link.url.replace(env.SHARE_WEBAPP, '');
    const res = await props.store.homeStore.getDramaByHashId(hashId);
    openDrama(res.id);
  };

  function openDrama(dramaId) {
    push('SinglePost', {
      dramaId
    })
  }

  return null
}

export default inject('store')(observer(DynamicLinkHandler))