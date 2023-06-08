import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { Record, UserData } from '../interfaces';
import { Misspelling, regionLanguageMap } from '../constants';
import { generateUserData, setFakerSeed } from '../utils';

const FakeDataGenerator = () => {
    const tableRef = useRef<HTMLTableElement>(null);

    const [region, setRegion] = useState<string>('USA');
    const [errorCount, setErrorCount] = useState<number>(0);
    const [seed, setSeed] = useState<number>(0);

    const [userData, setUserData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const languageModule = regionLanguageMap[region];

    const generateData = () => {
        scrollToTop();
        setIsLoading(true);
        setFakerSeed(languageModule, seed);
        const data: UserData[] = Array.from({ length: 20 }, (_, index) =>
            generateUserData(languageModule, index + 1)
        );
        setIsLoading(false);
        setUserData(data);
    };

    const loadMoreData = () => {
        setIsLoading(true);
        const startIndex = userData.length + 1;
        setFakerSeed(languageModule, seed, startIndex);
        const newData: UserData[] = Array.from({ length: 10 }, (_, index) =>
            generateUserData(languageModule, startIndex + index)
        );
        setIsLoading(false);
        setUserData((prevData) => [...prevData, ...newData]);
    };

    useEffect(generateData, [region, errorCount, seed, languageModule]);

    const scrollToTop = () => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            loadMoreData();
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegion(e.target.value);
    };

    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setSeed(isNaN(value) ? 0 : value);
    };

    const handleSliderChange = (value: number) => {
        setErrorCount(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setErrorCount(isNaN(value) ? 0 : value);
    };

    const handleGenerateClick = () => {
        // setSeed(generateRandomSeed(languageModule));
        const res = generateHumanMisspellings(errorCount, { name: 'Hello', phone: '123123123', address: 'World' });
        console.log(res);
    };

    const generateHumanMisspellings = (errorCount: number, record: Record) => {
        const integerPart: number = Math.trunc(errorCount);
        const fractionalPart: number = (errorCount % 1);

        const proceed = () => {
            const errorVariant = languageModule.number.int(2);

            const fields: (keyof Record)[] = Object.keys(record) as (keyof Record)[];
            const randomField: keyof Record = fields[languageModule.number.int(fields.length - 1)];

            const randomCharIndex = languageModule.number.int(record[randomField].length - 1);

            switch (errorVariant) {
                case Misspelling.AddCharacter:
                    record[randomField] = addRandomCharacter(record[randomField], randomCharIndex, languageModule.string.alpha());
                    break;
                case Misspelling.DeleteCharacter:
                    record[randomField] = deleteCharacter(record[randomField], randomCharIndex);
                    break;
                case Misspelling.SwapCharacters:
                    record[randomField] = swapCharacters(record[randomField], randomCharIndex);
                    break;
                default:
            }
        };

        const range = Array.from({ length: integerPart }, (_, i) => i);
        range.forEach(proceed);

        if (fractionalPart * 100 > languageModule.number.int(100)) {
            proceed();
        }

        return record;
    };

    const addRandomCharacter = (str: string, index: number, randomChar: string): string => {
        return str.slice(0, index) + randomChar + str.slice(index);
    };

    const deleteCharacter = (str: string, index: number): string => {
        return str.slice(0, index) + str.slice(index + 1);
    };

    const swapCharacters = (str: string, index: number): string => {
        if (index === str.length - 1) {
            return str.slice(0, index - 1) + str[index] + str[index - 1];
        } else {
            return str.slice(0, index) + str[index + 1] + str[index] + str.slice(index + 2);
        }
    };

    const handleExportClick = () => {
        return userData.map((user) => ({
            Index: user.index,
            Identifier: user.identifier,
            Name: user.name,
            Address: user.address,
            Phone: user.phone
        }));
    };

    return (
        <Container fluid>
            <Row className="mt-4">
                <Col>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Region
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control as="select" value={region} onChange={handleRegionChange}>
                                    <option value="USA">USA</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Ukraine">Ukraine</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <br />
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Error Count
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Range
                                    min={0}
                                    max={10}
                                    step={0.25}
                                    value={errorCount}
                                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                                />
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={1000}
                                    value={errorCount}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Form.Group>
                        <br />
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Seed
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control type="number" min={0} value={seed} onChange={handleSeedChange} />
                                <br />
                                <Button variant="secondary" onClick={handleGenerateClick}>
                                    Random
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <div style={{ height: '400px', overflowY: 'scroll' }} onScroll={handleScroll}>
                        <Table striped bordered hover ref={tableRef}>
                            <thead>
                            <tr>
                                <th>Index</th>
                                <th>Identifier</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userData.map((user) => (
                                <tr key={user.index}>
                                    <td>{user.index}</td>
                                    <td>{user.identifier}</td>
                                    <td>{user.name}</td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            ))}
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <CSVLink
                        data={handleExportClick()}
                        filename={'fake_data.csv'}
                        className="btn btn-primary"
                        target="_blank"
                    >
                        Export to CSV
                    </CSVLink>
                </Col>
            </Row>
        </Container>
    );
};

export default FakeDataGenerator;
