import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import { UserData } from '../interfaces';
import { Default, regionLanguageMap } from '../constants';
import { generateUserData } from '../utils';

const FakeDataGenerator = () => {
    const [region, setRegion] = useState<string>('');
    const [errorCount, setErrorCount] = useState<number>(0);
    const [seed, setSeed] = useState<string>('');

    const [userData, setUserData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateData = () => {
        setIsLoading(true);
        setTimeout(() => {
            const languageModule = regionLanguageMap[region];
            const data: UserData[] = Array.from({ length: 20 }, (_, index) =>
                generateUserData(index + 1, languageModule)
            );
            setIsLoading(false);
            setUserData(data);
        }, Default.TIMEOUT);
    };

    const loadMoreData = () => {
        setIsLoading(true);
        setTimeout(() => {
            const languageModule = regionLanguageMap[region];
            const startIndex = userData.length + 1;
            const newData: UserData[] = Array.from({ length: 10 }, (_, index) =>
                generateUserData(startIndex + index, languageModule)
            );
            setIsLoading(false);
            setUserData((prevData) => [...prevData, ...newData]);
        }, Default.TIMEOUT);
    };

    useEffect(generateData, [region, errorCount, seed]);

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
                        <br />
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

export default FakeDataGenerator;
