import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerHome: {
        flexDirection: 'row',
    },
    head: { height: 40, backgroundColor: '#808B97', textAlign: 'center' },
    text: { margin: 6, textAlign: 'left' },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1', justifyContent: 'flex-start' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff'}
});

export default styles