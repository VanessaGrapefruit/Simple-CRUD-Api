import { v4 } from "uuid";
import { User } from "../types/user";
import { join } from 'path';
import { readFile, writeFile } from "fs/promises";

export class UsersSchema {
    private static users: User[] = [];

    public static getUsers(): User[] {
        return this.users;
    }

    public static getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public static createUser(userDto: Omit<User, 'id'>): User {
        const user = { ...userDto, id: v4() };
        this.users.push(user);
        return user;
    }

    public static async initAsync() {
        const filename = join(process.cwd(), 'users-schema.json')

        const json = await readFile(filename).then(data => data.toString()).catch(() => '[]');
        this.users = JSON.parse(json);

        process.once('SIGUSR2', async () => {
            console.log('jkjkhgjk');
            await writeFile(filename, JSON.stringify(this.users));
            console.log('jkjkhgjk');
        });
    }
}