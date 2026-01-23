import GoalBox from "@/components/GoalBox";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <GoalBox goal={3}></GoalBox>
        <View style={styles.binaryContainer}>
          <View style={styles.binaryDigits}>
            1 0
          </View>
          <View style={styles.binaryCounter}>
            2
          </View>
        </View>
      </View>
      <View style={styles.shapeContainer}>Shape Box</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 1/4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'red',
    borderWidth: 1,
    width: '100%',
  },
  shapeContainer: {
    flex: 1,
    borderColor: 'yellow',
    borderWidth: 1,
    width: '100%',
  },
  goalContainer: {
    borderColor: 'blue',
    borderWidth: 1,
  },
  binaryContainer: {
    borderColor: 'green',
    borderWidth: 1,
  },
  binaryDigits: {

  },
  binaryCounter: {

  },
  text: {
    color: "#fff",
  }
})