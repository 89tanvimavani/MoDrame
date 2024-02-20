import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import colors from '../../constants/colors';
import TagInput from 'react-native-tags-input';
import { PRIMARY_FONT_BOLD, PRIMARY_FONT_LIGHT } from '../../constants/constants';
import { textStyles } from '../../styles-main/texts';
import Text from '../typography/Text'

const TagsInput = props => {
  const [ tags, setTags ] = useState({
    tag: '',
    tagsArray: []
  })

  function updateTagState(t) {
    setTags(t)
    props.onChange(t.tagsArray)
  }

  return (
    <View>
      <TagInput
        placeholderTextColor={colors.WHITE}
        updateState={updateTagState}
        tags={tags}
        placeholder="Add Tags"
        inputContainerStyle={styles.inputContainerStyle}
        containerStyle={styles.containerStyle}
        inputStyle={styles.inputStyle}
        leftElementContainerStyle={styles.leftElementContainerStyle}
        tagStyle={styles.tagStyle}
        tagTextStyle={styles.tagTextStyle}
        deleteElement={
          <View
            style={styles.wrapper}
          >
            <Text
              style={styles.text}
            >x</Text>
          </View>
        }
        leftElement={null}
      />
      {props.info && !props.error && tags.tagsArray.length === 0 && <Text style={styles.inputInfo}>{props.info}</Text>}
    </View>
  )
}

export default TagsInput

const styles = StyleSheet.create({
  inputContainerStyle: {
    marginBottom: 0,
    borderColor: colors.WHITE,
    borderBottomWidth: 1,
    paddingLeft: 0,
  },
  containerStyle: {
    marginBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
  },
  inputStyle: {
    fontFamily: PRIMARY_FONT_LIGHT,
    fontSize: 18,
    paddingBottom: 9,
    color: colors.WHITE,
    paddingLeft: 0
  },
  leftElementContainerStyle: {
    marginLeft: 0,
    paddingLeft: 0,
    width: 0
  },
  tagStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 32,
    paddingLeft: 0,
    paddingRight: 0
  },
  tagTextStyle: {
    color: colors.WHITE,
    fontFamily: PRIMARY_FONT_BOLD
  },
  text: {
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0
  },
  wrapper: {
    height: 15,
    width: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputInfo: {
    fontSize: 14,
    color: colors.SCORPION
  }
})