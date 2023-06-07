import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

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

        // Simulate API call to generate fake data
        // Replace this with your actual data generation logic
        setTimeout(() => {
            const data: UserData[] = [];
            // Generate 20 records
            for (let i = 1; i <= 20; i++) {
                const index = i;
                const identifier = generateRandomIdentifier();
                const name = generateRandomName();
                const address = generateRandomAddress();
                const phone = generateRandomPhone();

                data.push({ index, identifier, name, address, phone });
            }

            setIsLoading(false);
            setUserData(data);
        }, 500);
    }, []);

    useEffect(() => {
        // Fetch initial data
        generateData();
    }, [generateData]);

    useEffect(() => {
        // Regenerate data on region, error count, or seed change
        generateData();
    }, [region, errorCount, seed, generateData]);

    const generateRandomIdentifier = (): string => {
        // Generate random identifier logic
        return '';
    };

    const generateRandomName = (): string => {
        // Generate random name logic based on region
        return '';
    };

    const generateRandomAddress = (): string => {
        // Generate random address logic based on region
        return '';
    };

    const generateRandomPhone = (): string => {
        // Generate random phone logic based on region
        return '';
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
            const newData: UserData[] = [];
            const startIndex = userData.length + 1;

            // Generate 10 more records
            for (let i = startIndex; i <= startIndex + 10; i++) {
                const index = i;
                const identifier = generateRandomIdentifier();
                const name = generateRandomName();
                const address = generateRandomAddress();
                const phone = generateRandomPhone();

                newData.push({ index, identifier, name, address, phone });
            }

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
                                    <option value="">Select region</option>
                                    <option value="Poland">Poland</option>
                                    <option value="USA">USA</option>
                                    <option value="Georgia">Georgia</option>
                                    {/* Add more regions */}
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
