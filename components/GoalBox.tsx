import { StyleSheet, Text, View } from "react-native";

type Props = {
    goal: number;
};

export default function GoalBox({ goal }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.goal}>{goal}</Text>
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'yellow',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goal: {
        fontSize: 48,
        color: '#fff',
        padding: 12,
    },
})