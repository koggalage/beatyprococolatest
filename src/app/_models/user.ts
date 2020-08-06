import { Role } from "./role";

export class User {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: Role;
    token?: string;
}