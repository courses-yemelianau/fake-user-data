import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
// import { faker } from '@faker-js/faker';
import { faker } from '@faker-js/faker/locale/en';
import { faker as ruFaker } from '@faker-js/faker/locale/ru';
import { faker as ukFaker } from '@faker-js/faker/locale/uk';

const regionLanguageMap: { [key: string]: any } = {
    '': faker,
    USA: faker,
    Russia: ruFaker,
    Ukraine: ukFaker
};

interface UserData {
    index: number;
    identifier: string;
    name: string;
    address: string;
    phone: string;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const [region, setRegion] = useState<string>('');
    const [errorCount, setErrorCount] = useState<number>(0);
    const [seed, setSeed] = useState<string>('');

    const [userData, setUserData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateData = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const languageModule = regionLanguageMap[region];
            const data: UserData[] = Array.from({ length: 20 }, (_, index) => {
                const identifier = generateRandomIdentifier(languageModule);
                const name = generateRandomName(languageModule);
                const address = generateRandomAddress(languageModule);
                const phone = generateRandomPhone(languageModule);

                return { index: index + 1, identifier, name, address, phone };
            });

            setIsLoading(false);
            setUserData(data);
        }, 500);
    }, [region]);

    useEffect(() => {
        // Fetch initial data
        generateData();
    }, [generateData]);

    useEffect(() => {
        // Regenerate data on region, error count, or seed change
        generateData();
    }, [region, errorCount, seed, generateData]);

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

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            // Load more data on reaching the end of scroll
            loadMoreData();
        }
    };

    const loadMoreData = () => {
        setIsLoading(true);

        // Simulate API call to load more data
        // Replace this with your actual data loading logic
        setTimeout(() => {
            const languageModule = regionLanguageMap[region];
            const startIndex = userData.length + 1;
            const newData: UserData[] = Array.from({ length: 10 }, (_, index) => {
                const i = startIndex + index;
                const identifier = generateRandomIdentifier(languageModule);
                const name = generateRandomName(languageModule);
                const address = generateRandomAddress(languageModule);
                const phone = generateRandomPhone(languageModule);

                return { index: i, identifier, name, address, phone };
            });

            setIsLoading(false);
            setUserData((prevData) => [...prevData, ...newData]);
        }, 500);
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegion(e.target.value);
    };

    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeed(e.target.value);
    };

    const handleSliderChange = (value: number) => {
        setErrorCount(value);
    };

    const handleGenerateClick = () => {
        generateData();
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
                                    <option value="">Select language</option>
                                    <option value="USA">English</option>
                                    <option value="Russia">Russian</option>
                                    <option value="Ukraine">Ukrainian</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Error Count
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Range
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={errorCount}
                                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                                />
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={1000}
                                    value={errorCount}
                                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Seed
                            </Form.Label>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={seed}
                                    onChange={handleSeedChange}
                                />
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
                    <div
                        style={{ height: '400px', overflowY: 'scroll' }}
                        onScroll={handleScroll}
                    >
                        <Table striped bordered hover>
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
        </Container>
    );
};

export default App;
