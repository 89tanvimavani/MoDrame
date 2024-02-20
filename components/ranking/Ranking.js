import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import colors from '../../constants/colors'

const Ranking = (props) => {
   const ranking = props.ranks.map(rank => (
      <View 
        key={rank.status} 
        style={[
          styles.rank, 
          rank.last !== undefined && styles.lastRank
        ]}>
        <View>
          <Image source={rank.img} style={styles.image}/>
        </View>
        <View style={styles.flex}>
          <Text style={styles.title}>
            {rank.status}
          </Text>
          <Text style={styles.description}>
            {rank.challenges} Challenges and {rank.wins} wins
          </Text>
        </View>  
      </View>
    )) 

  return (
    <View style={styles.wrapper}>
      {ranking}
    </View>
  )
}

export default Ranking

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 15,
    width: "100%"
  },
  rank: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderColor: colors.TUNDORA
  },
  lastRank: {
    borderBottomWidth: 0
  },
  flex: {
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 5
  },
  description: {
    fontSize: 14 ,
    color: colors.WHITE
  },
  image: {
    height: 27, 
    width: 27
  }
})