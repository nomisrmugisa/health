// const Cube(x: number): number;

// export default class Cube {
//     cube(x: number): number;
// }
import fullMetaData from "./fullMetaData.json"

type generateMetaNamesFn<T> = () => { eng: string; other: string }[];
type generateMetaObjFn<T> = ([string]) => fullMetaData;

export const generateMetadataNames: generateMetaNamesFn<string>

export const generateNewMetaObject: generateMetaObjFn