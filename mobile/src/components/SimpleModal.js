import { View, StyleSheet, Modal } from "react-native"
import { Card } from "react-native-paper"

const SimpleModal = ({ visible, onDismiss, children }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Card style={styles.modal}>{children}</Card>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
  },
})

export default SimpleModal
