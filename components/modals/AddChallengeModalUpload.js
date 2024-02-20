import { inject, observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View, Image, ScrollView, 
  TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Text from '../typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Button from '../button/Button'
import Link from '../typography/Link'
import { ICONS } from '../../constants/images'
import UploadButton from '../button/UploadButton'
import Input from '../input/Input'
import { useNavigation } from '@react-navigation/native'
import TagsInput from '../input/TagsInput'
import VideoPreview from '../video/VideoPreview'
import UploadingStatus from '../uploading-status/UploadingStatus'
import UploadingStatusFinished from '../uploading-status/UploadingStatusFinished'
import TransparentButton from '../button/TransparentButton'
import { useIsFocused } from '@react-navigation/native'

const AddChallengeModalUpload = (props) => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const { createChallengeStore } = props.store

  function startedUploading(url) {
    createChallengeStore.upload(url)
  }

  function submit() {
    createChallengeStore.updateChallenge()
    props.onRequestClose()
    navigation.navigate('ChallengeSubmitted')
  }

  function resetStore() {
    createChallengeStore.removeVideo()
  }

  return (
    <Modal
      noMargin
      open={props.open}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <ScrollView 
          bounces={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.scrollView}>
        <TransparentButton
          onlyIconButton
          absoluteRight
          icon={ICONS['close']}
          onPress={props.onRequestClose}
        />
        <View style={styles.top}>
          <Image source={ICONS['addchallenge']} style={styles.image}/>
          <Text style={styles.title}>Create challenge</Text>
        </View>

        <View style={styles.load}>
          <UploadButton 
            challenge
            roundIconButton
            resetStore={resetStore}
            loading={createChallengeStore.loading}
            upload={startedUploading}
          />
          <Text 
            style={[
              styles.title,
              { marginTop: 12 }
            ]}>
            TAP HERE TO {createChallengeStore.video?.id && "RE"}UPLOAD VIDEO</Text>
        </View>

        <View style={styles.previewWrap}>
          <VideoPreview
            hide={!isFocused}
            src={createChallengeStore.video?.url}
          />
        </View>
        <View style={styles.status}>
              {createChallengeStore.uploadingVideo ? 
                <UploadingStatus 
                  progress={createChallengeStore.video.progress}
                /> : null
              }
              { !createChallengeStore.uploadingVideo && createChallengeStore.video.url ? 
                <>
                { createChallengeStore.video.uploaded ?
                  <UploadingStatusFinished
                    error={false}
                    text='Successfully added'
                  /> :
                  <UploadingStatusFinished 
                    error={true}
                    text='Error uploading video'
                  />
                }
                </> : null
              }
            </View>
        
          <TouchableOpacity>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.content}>
                  <View style={styles.inputWrap}>
                    <Input 
                      placeholder="Challenge title"
                      label="CHALLENGE TITLE"
                      onChangeText={val => createChallengeStore.set('title', val)}
                      value={createChallengeStore.title || ''}
                    />
                  </View>
                  <View style={styles.inputWrap}>
                    <Input 
                      placeholder="Challenge description"
                      label="CHALLENGE DESCRIPTION"
                      onChangeText={val => createChallengeStore.set('description', val)}
                      value={createChallengeStore.description || ''}
                    />
                  </View>
                  <View style={styles.inputWrap}>
                    <TagsInput
                      onChange={tags => {
                        try {
                          createChallengeStore.set('tags', tags)
                        } catch (err) {
                        }
                      }}
                      info="Press space to add tag"
                    />
                  </View>

                  <View style={styles.disclaimer}>
                    <Image source={ICONS['info']} style={{ marginRight: 8}}/>
                    <Text 
                      style={styles.p}>
                      Please adhere to our{' '}
                      <Text style={styles.policies}>
                        policies 
                      </Text>
                      {' '}while creating a challenge, after your submission you may have 
                      to wait up to 72 hours to find out if you have won (
                      <Text 
                        style={{ fontWeight: 'bold'}}>
                        rewards worth $100 or more 
                      </Text>
                      ) and if your 
                      challenge will be published on Versuz. 
                    </Text>
                  </View>

                </View>
              
                <View style={styles.buttonWrap}>
                  <Button
                    height={50}
                    width={142}
                    disabled={!createChallengeStore.validPublish}
                    center
                    onPress={() => submit()}
                    >SUBMIT</Button>
                  <View style={{height: 20}}/>
                  <Link
                    center
                    onPress={props.onRequestClose}
                    >CANCEL</Link>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </ScrollView>
      </View> 
    </Modal>
  )
}

export default inject('store')(observer(AddChallengeModalUpload))

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 70,
    backgroundColor: colors.MINE_SHAFT,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: 'center'
  },
  top: {
    position: 'absolute',
    top: 20,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 3
  },
  image: {
    height: 17, 
    width: 17.3, 
    marginRight: 12
  },
  title: {
    fontSize: 18,
    color: colors.WHITE
  },
  load: {
    position: 'absolute',
    zIndex: 3,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewWrap: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.DOVE_GRAY,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 16
  },
  scrollView: {
    width: '100%',
  },
  inputWrap: {
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    width: "100%"
  },
  p: {
    color: colors.WHITE,
    fontSize: 15,
    lineHeight: 22
  },
  policies: {
    fontWeight: 'bold',
    color: colors.MARINER,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    backgroundColor: colors.TUNDORA,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 16,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6
  },
  buttonWrap: {
    paddingTop: 20,
    paddingBottom: 40
  },
  status: {
    position: 'absolute',
    top: 250
  },
})