import { SelectionLop } from './selectionLop';

export interface UserLop {
    uid: string;
    name: string;
    urlPhoto: string;
    lastDateSelected: number;
    selection: SelectionLop;
}
