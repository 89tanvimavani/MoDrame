import React from 'react'
import { FlatList, View, RefreshControl } from 'react-native'
import Challenge from '../challenge/Challenge'
import EmptyList from '../placeholders/EmptyList'
import colors from '../../constants/colors'
import { useIsFocused } from '@react-navigation/native'
import { FlashList } from "@shopify/flash-list";

const ChallengesList = (props) => {
  const isFocused = useIsFocused()

  return (
    <FlashList 
      scrollIndicatorInsets={{ right: 1 }}
      contentContainerStyle={{ paddingBottom: 32}}
      estimatedItemSize={177}
      ListHeaderComponent={() => <View style={{ height: 16 }}/>}
      data={props.challenges}
      extraData={{
        length: props.length,
        isFocused
      }}
      ListEmptyComponent={() =>
        <EmptyList 
          challenges
          loading={props.loading}
          openModal={props.openModal}
          description={"Looks like you have not created a challenge yet. Please tap on the button below to start your journey in building challenges and chances to win exciting prizes every time you submit a challenge."}
        />
      }
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      keyExtractor={item => `${item.id}`}
      refreshControl={
        <RefreshControl 
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
          tintColor={colors.LIGHTNING_YELLOW}
        />
      }
      renderItem={({ item }) => (
        <Challenge 
          onPress={() => props.openChallenge(item)}
          title={item.title}
          description={item.description}
          gif={item.video?.gif}
          dueDateStr={item.dueDateStr}
          status={item.challengeStatus}
          won={item.winningDrama}
          disabled={item.disableParticipate}
        />
      )}
    />
  )
}

export default ChallengesList

