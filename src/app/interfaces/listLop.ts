import { UserLop } from './userLop';

export interface ListLop {
    uid: string;
    name: string;
    members: UserLop[];
}