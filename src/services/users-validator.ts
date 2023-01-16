import { User } from '../types/user';
import { validate } from 'uuid';

export class UsersValidator {
    public static isValidUser(user: object): user is Omit<User, 'id'> {
        if (!user) return false;

        const { username, age, hobbies } = user as any;

        const isUsernameValid = username && typeof username === 'string';
        const isAgeValid = age && typeof age === 'number';
        const isHobbiesValid = Array.isArray(hobbies) && hobbies.every(item => typeof item === 'string');

        return isUsernameValid && isAgeValid && isHobbiesValid;
    }

    public static isValidId(id?: string): id is string {
        if (!id) {
            return false;
        }

        return validate(id);
    }
}