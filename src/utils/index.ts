import { Faker } from '@faker-js/faker';
import { UserData } from '../interfaces';

const generateRandomIdentifier = (fakerModule: Faker): string => {
    return fakerModule.string.uuid();
};

const generateRandomName = (fakerModule: Faker): string => {
    return fakerModule.person.fullName();
};

const generateRandomAddress = (fakerModule: Faker): string => {
    return fakerModule.location.streetAddress();
};

const generateRandomPhone = (fakerModule: Faker): string => {
    return fakerModule.phone.number();
};

export const generateRandomSeed = (fakerModule: Faker): number => {
    return fakerModule.number.int();
};

export const setFakerSeed = (fakerModule: Faker, seed: number, page: number = 0): void => {
    fakerModule.seed([seed, page]);
};

export const generateUserData = (fakerModule: Faker, index: number): UserData => {
    const identifier = generateRandomIdentifier(fakerModule);
    const name = generateRandomName(fakerModule);
    const address = generateRandomAddress(fakerModule);
    const phone = generateRandomPhone(fakerModule);
    return { index, identifier, name, address, phone };
};
