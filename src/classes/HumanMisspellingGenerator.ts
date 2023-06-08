import { Faker } from '@faker-js/faker';
import { Record } from '../interfaces';
import { addCharacter, deleteCharacter, swapCharacters } from '../utils';

interface MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void;
}

class AddCharacterStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = addCharacter(record[randomField], randomCharIndex);
    }
}

class DeleteCharacterStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = deleteCharacter(record[randomField], randomCharIndex);
    }
}

class SwapCharactersStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = swapCharacters(record[randomField], randomCharIndex);
    }
}

export default class HumanMisspellingGenerator {
    private languageModule: Faker;
    private strategies: MisspellingStrategy[];

    constructor(languageModule: Faker) {
        this.languageModule = languageModule;
        this.strategies = [
            new AddCharacterStrategy(),
            new DeleteCharacterStrategy(),
            new SwapCharactersStrategy()
        ];
    }

    private execute(record: Record) {
        const errorVariant = this.languageModule.number.int(2);
        const fields: (keyof Record)[] = Object.keys(record) as (keyof Record)[];
        const randomField: keyof Record = fields[this.languageModule.number.int(fields.length - 1)];
        const randomCharIndex = this.languageModule.number.int(
            record[randomField].length > 0
                ? record[randomField].length - 1
                : record[randomField].length
        );

        this.strategies[errorVariant].execute(record, randomField, randomCharIndex);
    }

    generate(errorCount: number, record: Record): Record {
        const integerPart: number = Math.trunc(errorCount);
        const fractionalPart: number = errorCount % 1;

        const range = Array.from({ length: integerPart }, (_, i) => i);
        range.forEach(() => this.execute(record));

        if (fractionalPart * 100 > this.languageModule.number.int(100)) {
            this.execute(record);
        }

        return record;
    }
}
