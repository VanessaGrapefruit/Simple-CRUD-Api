import { v4 } from "uuid";
import { User } from "../types/user";
import { join } from 'path';
import { readFile } from "fs/promises";

export class UsersSchema {
    private static users: Map<string, User> = new Map<string, User>();

    public static getUsers(): User[] {
        return [ ...this.users.values() ];
    }

    public static getUserById(id: string): User | undefined {
        return this.users.get(id);
    }

    public static createUser(userDto: Omit<User, 'id'>): User {
        const id = v4();
        const user = { ...userDto, id };
        this.users.set(id, user);
        return user;
    }

    public static updateUser(userDto: Omit<User, 'id'>, id: string): User | null {
        if (this.users.has(id)) {
            const updatedUser = { ...userDto, id };
            this.users.set(id, updatedUser);
            return updatedUser;
        } else {
            return null;
        }
    }

    public static deleteUser(id: string): boolean {
        if (this.users.has(id)) {
            this.users.delete(id);
            return true;
        } else {
            return false;
        }
    }

    public static async initAsync() {
        const filename = join(process.cwd(), 'src/users-schema.json')

        const json = await readFile(filename).then(data => data.toString()).catch(() => '[]');
        const array: User[] = JSON.parse(json);
        array.forEach(user => {
            this.users.set(user.id, user);
        })
    }
}