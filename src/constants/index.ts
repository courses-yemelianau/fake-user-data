import { Faker } from '@faker-js/faker';
import { faker } from '@faker-js/faker/locale/en';
import { faker as ruFaker } from '@faker-js/faker/locale/ru';
import { faker as ukFaker } from '@faker-js/faker/locale/uk';

export enum Env {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Staging = 'staging'
}

export const {
    NODE_ENV = Env.Development
} = process.env;

export const regionLanguageMap: { [key: string]: Faker } = {
    USA: faker,
    Russia: ruFaker,
    Ukraine: ukFaker
};

export const Default = {
    TIMEOUT: 1000
};
