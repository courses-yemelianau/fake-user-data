import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { UserData } from '../interfaces';
import { regionLanguageMap } from '../constants';
import { generateRandomSeed, generateUserData, setFakerSeed } from '../utils';

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
        setSeed(generateRandomSeed(languageModule));
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
