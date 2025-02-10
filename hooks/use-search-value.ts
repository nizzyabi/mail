import { atom, useAtom } from "jotai";

type Config = {
  value: string;
};

const configAtom = atom<Config>({
  value: "",
});

export function useSearchValue() {
  return useAtom(configAtom);
}
