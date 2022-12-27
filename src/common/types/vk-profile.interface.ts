import { Profile } from 'passport-vkontakte';

// у библиотеки passport-vkontakte неполные типы для Profile
export interface VKProfile extends Profile {
    birthday?: string;
    photos: {
        value: string;
        type: string;
    }[];
}
