import React from 'react'
import { useState, useEffect, useRef, memo } from 'react'
import colors from '../../constants/colors';
import { Share, StyleSheet, Pressable, Image, View } from 'react-native';
import { ICONS } from '../../constants/images';
import { HEIGHT } from '../../constants/mesures';
import firebase from '@react-native-firebase/app';
import Button from '../button/Button';
import { env } from '../../config'

const ShareButton = props => {
  const [dramaLink, setDramaLink] = useState('')
  const [disabled, setDisabled] = useState(false)
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return  
    }
  onShare()}, [dramaLink])

  const generateLink = async () => {
    try {
      let description = 'Check+out+this+drama';
      if (props.dramaDescription) description = props.dramaDescription;
      
      let dramaPreview = null;
      if (props.dramaPreview) dramaPreview = props.dramaPreview;

      let dynamicLink = await firebase.dynamicLinks().buildShortLink({
        link: env.SHARE_WEBAPP + props.dramaId,
        ios: {
          bundleId: 'org.socialapp.modrama',
          appStoreId: '1566137338',
        },
        android: {
          packageName: 'com.app.modrama',
        },
        domainUriPrefix: 'https://versuz.page.link',
        social: {
          title: 'Versuz',
          descriptionText: description,
          imageUrl: dramaPreview
        }
      }, firebase.dynamicLinks.ShortLinkType.UNGUESSABLE);
      
      generatedPath = dynamicLink.replace('https://versuz.page.link/', '');

      const shareLink = env.REDIRECT_WEBAPP + generatedPath + '/' + props.dramaId;
      return shareLink;
    }
    catch (err) {
      return null
    }
  }

  async function shareDrama() {
    setDisabled(true)
    let link = await generateLink()

    if (link) {
      if (dramaLink != link) {
        setDramaLink(link);
      } else {
        onShare();
      }
    }
    setDisabled(false)
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: dramaLink
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.apple.mobilenotes.SharingExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
        ]
      });
    } catch (error) {
    }
  };

  return (
    <View>
      {!props.submittedScreen ? 
      <Pressable 
        style={styles.shareWrapper}
        onPress={() => {
          if (!disabled) shareDrama()
        }}>
        <Image source={ICONS.share} />
      </Pressable> :
      <Button
        disabled={props.disabled}
        width={185}
        height={50}
        center={true}
        onPress={!disabled && shareDrama}
        share
        >
        Share this challenge
      </Button> }
    </View>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default memo(ShareButton, propsAreEqual)

const styles = StyleSheet.create({
  shareWrapper: {
    position: 'relative',
    marginBottom: 10,
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: colors.WHITE,
    padding: 11
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    marginTop: HEIGHT / 2,
    backgroundColor: colors.WHITE,
    padding: 40
  },
  buttonWrapper: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 15
  }
})