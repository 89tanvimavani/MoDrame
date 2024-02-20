import React, {useEffect, useState, useRef} from 'react'
import {RefreshControl} from 'react-native'
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'
import Post from '../../post/Post'
import { WIDTH } from '../../../constants/mesures'
import colors from '../../../constants/colors'
import { X_POST, NUMBER_OF_ANIMATIONS } from '../../../constants/globals'
import Loading from '../../placeholders/Loading'

const ViewTypes = {
  TYPE_VIDEO: 0
};

const ListView = React.forwardRef((props, ref) => {
  useEffect(() => {
    setDataProvider(dataProvider.cloneWithRows(props.posts))
  }, [props.postLength])

  const visibleLog = (all, now, notNow) => {
    if (now[0] === 3 && props.setShowChallengeTutorial) 
      props.setShowChallengeTutorial(true)
  }

  const animateButton = (index) => {
    return index % X_POST === 0 && index < NUMBER_OF_ANIMATIONS * X_POST && props.activateButton
  }
  
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1?.id !== r2?.id;
    }),
  );

  const layoutProvider = useRef(new LayoutProvider(
    index => {
      return ViewTypes.TYPE_VIDEO
    },
    (type, dim) => {
      dim.width = WIDTH;
      dim.height = props.height
    },
  )).current

  const rowRenderer = (type, item, index) => {
    switch (type) {
      case ViewTypes.TYPE_VIDEO:
        return <Post
                  height={props.height}
                  channel={props.channel}
                  animateButton={animateButton(index)}
                  id={item?.id}
                  hashId={item?.hashId}
                  reportVisible={!item.mine}
                  uri={item?.video?.src}
                  poster={item?.video?.thumbnail}
                  duration={item?.video?.duration}
                  description={item?.description}
                  reactions={item?.reactions}
                  numberOfReactions={item.numberOfReactions}
                  challenge={item?.challenge}
                  border={item?.frame}
                  icon={item?.icon}
                  user={item?.user}
                  tags={item?.tags}
                  winner={item?.winner}
                  views={item?.formattedViews}
                  reactionId={item?.reactionId}
                  profilePress={props.profilePress}
                  challengePress={props.challengePress}
                  react={props.react}
                  onView={props.onView}
                  goBack={props.goBack ? props.goBack : null}
                  setLoaded={props.setLoaded && props.firstDrama(item?.id) ? props.setLoaded : null}
                  firstDrama={props.firstDrama && props.firstDrama(item?.id) ? props.firstDrama : null}
                />;
      default:
        return null
    }
  }

  if (props.postLength > 0) {
    return (
      <RecyclerListView
        ref={ref}
        style={{flex: 1}}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        initialRenderIndex={props.initialScrollIndex}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.height*2}
        rowRenderer={rowRenderer}
        renderAheadOffset={props.height*3}
        onVisibleIndicesChanged={visibleLog}
        showsVerticalScrollIndicator={false}
        onScroll={props.onScroll}
        pagingEnabled={true}
        scrollViewProps={{
          refreshControl: (
            <RefreshControl 
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
              tintColor={colors.LIGHTNING_YELLOW}
            />
          )
        }}
        extendedState={{
          update: props.update,
          loading: props.loading
        }}
        renderFooter={props.footerComponent}
      />
    );
  } else {
    return <Loading height={props.height}/>
  }
})

export default ListView