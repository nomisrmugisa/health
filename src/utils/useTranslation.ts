import { useStore } from "../Context";

export const useTranslation = () => {
	const store = useStore();
	const lang = store.activeLanguage;

	return (key: string) => lang?.lang[key] ?? key;
};
