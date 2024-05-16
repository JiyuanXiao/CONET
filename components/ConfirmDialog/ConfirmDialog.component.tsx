import { Button, Dialog, Portal } from "react-native-paper";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ConfirmDialogProps } from "@/constants/Types";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  setDialogVisible,
  confirm_message,
  setIsConfirm,
}) => {
  const { colors } = useTheme();
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setIsConfirm(false);
          setDialogVisible(false);
        }}
        style={{ backgroundColor: colors.background }}
      >
        <Dialog.Content>
          <Text style={{ color: colors.notification, fontSize: 16 }}>
            {confirm_message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setIsConfirm(true);
              setDialogVisible(false);
            }}
            textColor={colors.text}
            labelStyle={{ fontSize: 15 }}
          >
            确认
          </Button>
          <Button
            onPress={() => {
              setIsConfirm(false);
              setDialogVisible(false);
            }}
            textColor={colors.text}
            labelStyle={{ fontSize: 15 }}
          >
            取消
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;
