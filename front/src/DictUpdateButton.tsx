import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function DictUpdateButton() {
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.post(
        "https://1thrt62esf.execute-api.ap-northeast-1.amazonaws.com/glossaries",
      ),
    onSuccess: () => alert("辞書を更新しました"),
    onError: () => alert("辞書の更新に失敗しました"),
  });
  return (
    <button onClick={() => mutate()} disabled={isPending}>
      辞書更新
    </button>
  );
}
