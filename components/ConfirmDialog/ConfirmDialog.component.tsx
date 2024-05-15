import { Button, Dialog, Portal } from "react-native-paper";
import { Text } from "react-native";
import { ConfirmDialogProps } from "@/constants/Types";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  setDialogVisible,
  confirm_message,
  setIsConfirm,
}) => {
  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Content>
          <Text>{confirm_message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setIsConfirm(true);
              setDialogVisible(false);
            }}
          >
            确认
          </Button>
          <Button
            onPress={() => {
              setIsConfirm(false);
              setDialogVisible(false);
            }}
          >
            取消
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;
