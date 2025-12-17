import Toast from "react-native-toast-message";

interface ToastParams {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export const showToast: (params: ToastParams) => void = ({
  type,
  title,
  message,
}) =>
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    visibilityTime: 2000,
  });
