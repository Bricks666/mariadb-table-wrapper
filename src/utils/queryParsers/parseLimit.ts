import { SQL, TablePage } from "../..";

export const parseLimit = ({ page, countOnPage }: TablePage): SQL => {
	const start = (page - 1) * countOnPage;
	return `LIMIT ${start},${countOnPage}`;
};
