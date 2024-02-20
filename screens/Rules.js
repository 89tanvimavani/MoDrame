import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import { ICONS } from '../constants/images'

const Rules = (props) => {

  const insets = useSafeAreaInsets()

  return (
    <View style={styles.outer}>
      <Pressable onPress={() => props.navigation.goBack()} style={[
        styles.close,
        {
          top: insets.top
        }
      ]}>
        <Image source={ICONS.close}/>
      </Pressable>
      <ScrollView style={[
        {
          paddingTop: insets.top
        },
        styles.wrapper
      ]}>
        <Text style={styles.title}>Rules and Guidelines</Text>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
            Introduction:
          </Text>
          <Text style={styles.text}>
          Please read the following rules and guidelines 
carefully to ensure a safe and enjoyable experience 
for all users. By participating in challenges within 
this app, you agree to abide by these rules and 
understand that Apple is not involved in any way 
with the challenges offered within this app.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
            General Rules:
          </Text>
          <Text style={styles.text}>
          <Text style={styles.bold}>Challenge Participation</Text>: To participate in 
challenges, users must follow the provided 
instructions and create videos showcasing their 
completion of challenge.
{"\n"}
{"\n"}
<Text style={styles.bold}>Content Guidelines</Text>: Videos must adhere to our 
content guidelines, which prohibit any content that 
is illegal, harmful, abusive, explicit, or infringing upon 
the rights of others. We reserve the right to remove 
any inappropriate content and suspend or ban users 
who violate these guidelines.
{"\n"}
{"\n"}
<Text style={styles.bold}>Prizes and Rewards</Text>: Users have the opportunity 
to win prizes and rewards based on the challenges 
they participate in. Prizes will be awarded according 
to the rules of each specific challenge.
{"\n"}
{"\n"}
<Text style={styles.bold}>No Purchase Necessary</Text>: No purchase is required 
to participate in challenges. Alternative methods of 
entry, where applicable, will be provided.
{"\n"}
{"\n"}
<Text style={styles.bold}>Apple Disclaimer</Text>: Apple is not a sponsor of the 
challenges within this app. The challenges are 
organized solely by the app’s developer.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
            User Conduct:
          </Text>
          <Text style={styles.text}>
          <Text style={styles.bold}>Respect</Text>: Users are expected to treat each other 
with respect and courtesy. Harassment, bullying, 
hate speech, or any form of abusive behavior 
towards others will not be tolerated.
{"\n"}
{"\n"}
<Text style={styles.bold}>Privacy</Text>: Users must respect the privacy of others. 
Do not share personal information or any content 
that violates someone else’s privacy.
{"\n"}
{"\n"}
<Text style={styles.bold}>Appropriate Content</Text>: Users are responsible for 
the content they upload and must ensure it complies 
with our content guidelines.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
            Dispute Resolution:
          </Text>
          <Text style={styles.text}>
          <Text style={styles.bold}>Disputes</Text>: Any disputes or concerns related to 
challenges or the app’s functionality should be 
directed to our support team through the app’s 
designated contact channels.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
            Termination of Accounts:
          </Text>
          <Text style={styles.text}>
          <Text style={styles.bold}>Account Termination</Text>: The app reserves the right 
to suspend or terminate user accounts for violations 
of these rules or for any other reason deemed 
necessary to maintain the integrity of the app.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.subtitle}>
          Updates to Rules:
          </Text>
          <Text style={styles.text}>
          <Text style={styles.bold}>Rule Changes</Text>: These rules and guidelines may be 
updated from time to time. Users will be notified of 
any changes, and continued use of the app implies 
acceptance of the updated rules.
          </Text>
        </View>

        <View style={{ height: insets.bottom + 100 }}></View>

      </ScrollView>
    </View>
  )
}

export default Rules

const styles = StyleSheet.create({
  outer: {
    flex: 1
  },
  close: {
    position: 'absolute',
    right: 10,
    height: 40,
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16
  },
  title: {
    color: colors.WHITE,
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    color: colors.WHITE,
    fontSize: 17,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  text: {
    color: colors.WHITE,
    fontSize: 14,
    lineHeight: 20
  },
  bold: {
    fontWeight: 'bold'
  },
  block: {
    marginVertical: 16
  }
})