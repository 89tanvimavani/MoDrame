import { inject, observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View, Image, ScrollView, 
  TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import Button from '../components/button/Button'
import Link from '../components/typography/Link'
import TransparentButton from '../components/button/TransparentButton'
import { ICONS } from '../constants/images'
import UploadButton from '../components/button/UploadButton'
import Input from '../components/input/Input'
import TagsInput from '../components/input/TagsInput'
import VideoPreview from '../components/video/VideoPreview'
import UploadingStatus from '../components/uploading-status/UploadingStatus'
import UploadingStatusFinished from '../components/uploading-status/UploadingStatusFinished'
import Toast from 'react-native-toast-message'
import { useIsFocused } from '@react-navigation/native'

const UploadChannelPost = (props) => {
  const isFocused = useIsFocused()
  
  const { uploadChannelStore } = props.store

  function startedUploading(url) {
    uploadChannelStore.upload(url).then(res => {
      if (res.error) {
        Toast.show({
          type: 'error',
          text1: 'Error uploading video',
          text2: 'Sorry, this was unexpected, please try again.'
        })
      }
    })
  }

  function submit() {
    uploadChannelStore.updatePost()
    props.navigation.navigate('Channel')
  }

  function resetStore() {
    uploadChannelStore.removeVideo()
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        bounces={false}
        contentContainerStyle={{alignItems: 'center'}}
        style={styles.scrollView}>
      <TransparentButton
        onlyIconButton
        absoluteRight
        icon={ICONS['close']}
        onPress={() => props.navigation.navigate('Channel')}
      />

      <View style={styles.load}>
        <UploadButton 
          roundIconButton
          resetStore={resetStore}
          loading={uploadChannelStore.loading}
          upload={startedUploading}
        />
        <Text 
          style={[
            styles.title,
            { marginTop: 12 }
          ]}>
          TAP HERE TO {uploadChannelStore.video?.id && "RE"}UPLOAD VIDEO</Text>
      </View>

      <View style={styles.previewWrap}>
        <VideoPreview
          hide={!isFocused}
          src={uploadChannelStore.video?.url}
        />
      </View>
      <View style={styles.status}>
            {uploadChannelStore.uploadingVideo ? 
              <UploadingStatus 
                progress={uploadChannelStore.video.progress}
              /> : null
            }
            { !uploadChannelStore.uploadingVideo && uploadChannelStore.video.url ? 
              <>
              { uploadChannelStore.video.uploaded ?
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
                    placeholder="Description"
                    label="DESCRIPTION"
                    onChangeText={val => uploadChannelStore.set('description', val)}
                    value={uploadChannelStore.description || ''}
                  />
                </View>
                <View style={styles.inputWrap}>
                  <TagsInput
                    onChange={tags => {
                      try {
                        uploadChannelStore.set('tags', tags)
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
                    {' '}while creating this video.
                  </Text>
                </View>

              </View>
            
              <View style={styles.buttonWrap}>
                <Button
                  height={50}
                  width={142}
                  disabled={!uploadChannelStore.validPublish}
                  center
                  onPress={() => submit()}
                  >SUBMIT</Button>
                <View style={{height: 20}}/>
                <Link
                  center
                  onPress={() => props.navigation.navigate('Channel')}
                  >CANCEL</Link>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </ScrollView>
    </View> 
  )
}

export default inject('store')(observer(UploadChannelPost))

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
    margin: 16,
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