import { UserData } from '../interfaces';

const generateRandomIdentifier = (fakerModule: any): string => {
    return fakerModule.string.uuid();
};

const generateRandomName = (fakerModule: any): string => {
    return fakerModule.person.fullName();
};

const generateRandomAddress = (fakerModule: any): string => {
    return fakerModule.location.streetAddress();
};

const generateRandomPhone = (fakerModule: any): string => {
    return fakerModule.phone.number();
};

export const generateUserData = (index: number, fakerModule: any): UserData => {
    const identifier = generateRandomIdentifier(fakerModule);
    const name = generateRandomName(fakerModule);
    const address = generateRandomAddress(fakerModule);
    const phone = generateRandomPhone(fakerModule);
    return { index, identifier, name, address, phone };
};
