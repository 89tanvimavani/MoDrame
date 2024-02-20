import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  View,
  StyleSheet,
  Image,
  Linking,
  Pressable,
  RefreshControl
} from 'react-native'
import { inject, observer } from 'mobx-react'
import colors, { BACKGROUND_COLOR } from '../constants/colors'
import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { ICONS } from '../constants/images'
import ProfileAvatar from '../components/avatar/ProfileAvatar'
import PostTile from '../components/post-tile/PostTile'
import Text from '../components/typography/Text'
import Button from '../components/button/Button'
import ProfileMenuModal from '../components/modals/ProfileMenuModal'
import RankingModal from '../components/modals/RankingModal'
import LoadingTile from '../components/placeholders/LoadingTile'
import { WIDTH } from '../constants/mesures'
import TransparentButton from '../components/button/TransparentButton'
import FyiCard from '../components/fyi-card/FyiCard'
import GrandPrize from '../components/challenge/sub-components/GrandPrize'
import EmptyPlaceholder from '../components/placeholders/EmptyPlaceholder'
import BirthdayTile from '../components/post-tile/BirthdayTile'
import { FlashList } from "@shopify/flash-list";
import Loading from '../components/placeholders/Loading'

const Profile = props => {
  const isFocused = useIsFocused()  
  const insets = useSafeAreaInsets()

  const [ profile, setProfile ] = useState(null)
  const [ refreshing, setRefreshing ] = useState(false)
  const [ profileMenu, setProfileMenu ] = useState(false)
  const [ ranking, setRanking ] = useState(false)

  const { accountStore, profileFactory, homeStore, challengesStore } = props.store

  let userId = props.route?.params?.userId
  if (!userId) userId = accountStore.user?.id

  useEffect(() => {
    if (isFocused) { 
      profileFactory.getProfile(userId)
        .then(res => {
          setProfile(res)
          res.getUserStats()
          res.getDramas(true)
        })
    }
  }, [isFocused])

  function openDrama(drama) {
    props.navigation.navigate('SinglePost', { dramaId: drama.id }) 
  }

  function goToSettings() {
    props.navigation.navigate('Settings')
  }

  function openChallenges() {
    props.navigation.navigate('CHALLENGES')
  }

  function onRefresh() {
    setRefreshing(true)
    profile.getDramas(true)
      .then(() => {
        setRefreshing(false)
      })
  }

  function onBlock() {
    profile.user.set('blocked', true)
  }

  function onUnblock() {
    profile.user.set('blocked', false)
  }

  function onEndReached() {
    if (profile.empty) return null
    if (profile.loading) return null
    profile.nextPage()
  }

  const footerComponent = () => (
    profile.loading ? 
      <Loading iconOnly/> : null
  )

  function openChannel() {
    props.navigation.navigate('ChannelStack', {
      screen: 'Channel',
      params: { channelId: profile?.channel.id },
    });
  }

  function openLink() {
    let url = profile.user.webpage
    if (!(url.includes('https://') ||  url.includes('http://'))) 
      url = 'https://'.concat(url)
    
    Linking.openURL(url)
                .catch(err => {
                    console.error("Failed opening page because: ", err)
                    alert('Oops, failed to open page!')})
  }

  function items() {
    if (accountStore.user?.birthdayMonth && profile.mine) 
      return [
        { id: 'BIRTHDAY'},
        ...profile.dramas.slice()
      ]
    return profile.dramas.slice()
  }

  const renderItem = ({item, index}) => {
    if (item.id === 'BIRTHDAY') {
      var challenge = challengesStore.birthdayChallenge
      return <BirthdayTile
              dueDate={challenge?.dueDateStr}
              birthdayTileClick={() => {
                if (challenge) props.navigation.navigate('Challenge', { challenge })
                else props.navigation.navigate('CHALLENGES')
              }}
             />
    } else return  <PostTile 
                  gif={item.video?.gif}
                  thumbnail={item.video?.thumbnail}
                  frame={item.frame}
                  topFrame={item.user?.topFrame}
                  bottomFrame={item.user?.bottomFrame}
                  winner={item.winner}
                  views={item.formattedViews}
                  onPress={() => openDrama(item)}
                 />
  }

  if (!profile) return null
  return ( profile.user && 
    <>
      <View style={{...styles.header, paddingTop: insets.top }}>
        <View>
          { profile.mine ?
            <View style={{height: 10}}/> : null
          }
          <TransparentButton
            onlyIconButton
            icon={ICONS['back-channel']}
            onPress={() => props.navigation.goBack()}
          />
        </View>
        { !profile.mine ?
          <Pressable 
            onPress={() => setProfileMenu(true)}
            style={styles.menu}>
            <Image source={ICONS['menu']} />
          </Pressable> : null
        }
      </View>

      <View style={styles.profileHead}>
        <View>
          <ProfileAvatar
            src={profile.user?.avatar?.url}/>
          { profile.hasChannel && !profile.mine ? 
            <View style={styles.buttonPosition}>
              <TransparentButton 
                width={50} height={50}
                onlyIconButton
                icon={ICONS['channel-icon']}
                onPress={() => openChannel()}/>
            </View> : null
          }
          { profile.user.country ?
            <View style={styles.flagPosition}>
              <Image 
                style={{height: 22.5, width: 30}}
                source={{uri: profile.user?.countryLink }}/> 
            </View> : null
          }
        </View>
        <Text style={styles.name}>{profile.user?.name}</Text>
        <Text style={styles.handle}>@{profile.user?.handle}</Text>
        { profile.user?.bio ? 
          <Text style={styles.bio}>{profile.user?.bio}</Text> 
        : null }
        { profile.user?.webpage ? 
          <Pressable onPress={() => openLink()}>
            <Text style={styles.website} numberOfLines={1}>{profile.user.webpage}</Text>
          </Pressable> 
        : null }
        <View style={styles.stats}>
          { profile.rank ?
          <Pressable 
            style={styles.inline}
            onPress={() => setRanking(true)}>
            <Image source={profile.rank[1]} style={styles.image}/>
            <Text 
              style={styles.statRank}>
              {profile.rank[0]} 
            </Text>
          </Pressable> : null}

          <Text style={styles.stat}>
            Posts <Text style={{ color: colors.WHITE }}> {profile.numberOfDramas}</Text>
          </Text> 
          <Text style={styles.stat}>
            Wins <Text style={{ color: colors.WHITE }}> {profile.wins}</Text>
          </Text> 

          {profile.verified ?
            <Text style={styles.stat}>
              verified
            </Text> : null
          }
        </View>
        { profile.mine ?
          <View style={styles.inline}>
            <Pressable 
              style={styles.profileButtons}
              onPress={() => goToSettings()}>
              <Text style={styles.editProfileText}>Edit profile</Text>
            </Pressable> 
            { profile.hasChannel ? 
              <Pressable 
                style={styles.profileButtons}
                onPress={() => openChannel()}>
                <Text style={styles.editProfileText}>View channel</Text>
              </Pressable> : null 
            }
          </View> :
          <View style={{paddingTop: 14}}>
            { profile.hasChannel ? 
              <Button
                width={200}
                borderRadius={4}
                fontWeight='bold'
                onPress={() => openChannel()}>
                  GO TO CHANNEL
              </Button> : null
            }
          </View>
        }
      </View>
      {profile.user.blocked ?
        <Text style={styles.block}>You blocked this user. Their content is no longer visible to you.</Text> :
        <FlashList 
          scrollIndicatorInsets={{ right: 1 }}
          estimatedItemSize={WIDTH/3*1.56}
          data={items()}
          extraData={{
            length: profile.dramas.length,
            loading: profile.loading
          }}
          ListEmptyComponent={() =>
            profile.loading ? 
              <View style={styles.row}>
                <LoadingTile />
                <LoadingTile />
                <LoadingTile />
              </View>
            :
              <View style={styles.emptyWrapper}>
                { profile.mine ?
                <>
                  <FyiCard text="Enter challenges to win many exciting cash prizes and a chance to win the grand prize of the month."/>
                  { homeStore.hasGrandPrize ? 
                    <View style={{width: WIDTH - 30}}>
                      <GrandPrize
                        asset={homeStore.grandPrize?.photo?.url}
                        title={homeStore.grandPrize?.title}
                        description={homeStore.grandPrize?.descrption}/>
                    </View> : null }
                  <Button
                    center
                    height={50}
                    width={190}
                    fontWeight='bold'
                    onPress={openChallenges}
                  >PARTICIPATE & WIN</Button>
                </> : 
                <EmptyPlaceholder 
                  title="This user hasn't entered any challenges."
                  underline
                /> }
              </View>
          }
          contentContainerStyle={styles.dramas}
          keyExtractor={item => `${item.id}`}
          numColumns={3}
          renderItem={renderItem}
          ListFooterComponent={footerComponent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.LIGHTNING_YELLOW}
            />
          }
          onEndReached={onEndReached}
        />
      }
      <View 
      />
      <ProfileMenuModal 
        userId={profile.user.id}
        handle={profile.user.handle}
        onBlock={onBlock}
        onUnblock={onUnblock}
        blocked={profile.user.blocked}
        open={profileMenu}
        onRequestClose={() => setProfileMenu(false)}
      />
      <RankingModal 
        open={ranking}
        onRequestClose={() => setRanking(false)}
      />
    </>
  )
}

export default inject('store')(observer(Profile))

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    height: 44,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15
  },
  name: {
    fontSize: 21,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
    marginTop: 10
  },
  dramas: {
  
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH - 30,
    borderColor: colors.SCORPION,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 7,
    paddingBottom: 7
  },
  handle: {
    fontSize: 16,
    textAlign: "center",
    margin: 5,
    color: colors.SCORPION
  },
  bio: {
    width: WIDTH - 30,
    paddingRight: 40,
    color: colors.WHITE,
    fontSize: 15,
    marginBottom: 8,
    marginTop: 8,
    lineHeight: 24
  },
  website: {
    width: WIDTH - 30,
    overflow: 'hidden',
    color: colors.MARINER,
    fontSize: 15,
  },
  stat: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
    color: colors.SCORPION
  },
  statRank: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    margin: 5,
    color: colors.WHITE
  },
  profileButtons: {
    padding: 7,
    margin: 15,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.SILVER,
    borderRadius: 4,
    flex: 1,
  },
  editProfileText: {
    color: colors.SILVER,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 15
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  flagPosition: {
    position: 'absolute',
    top: 85,
    left: 70
  },
  buttonPosition: {
    position: 'absolute',
    top: 68,
    left: -25
  },
  inline: {
    display: 'flex',
    flexDirection: 'row'
  },
  image: {
    height: 27, 
    width: 27
  },
  block: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: 18,
    paddingHorizontal: 20,
    lineHeight: 24
  }
})