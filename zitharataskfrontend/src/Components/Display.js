import React, { useEffect, useState } from "react";
import { Container, Table, Pagination, Form, Button } from "react-bootstrap";

const Display = () => {
  const [dummyData, setDummyData] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setDummyData(jsonData);
      updateDataForCurrentPage(jsonData, currentPage);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const updateDataForCurrentPage = (allData, page) => {
    const indexOfLastRecord = page * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = allData.slice(indexOfFirstRecord, indexOfLastRecord);
    setData(currentRecords);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateDataForCurrentPage(dummyData, pageNumber);
    setSearchTerm("");
  };

  const handleSearch = () => {
    const filteredData = dummyData.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentPage(1); // Reset to the first page after search
    updateDataForCurrentPage(filteredData, 1);
  };

  useEffect(() => {
    if (searchTerm === "") {
      fetchData();
    } else {
      handleSearch();
    }
  }, [searchTerm]);

  return (
    <>
      <Container className="my-4">
        <Form className="my-3" style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
          <Form.Select
            aria-label="Default select example"
            style={{ width: "30%" }}
          >
            <option>Sort</option>
            <option value="1">Date</option>
            <option value="2">Time</option>
          </Form.Select>
          <Form.Group style={{ width: "30%" }}>
            <Form.Control
              type="text"
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>SNo</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.sno}</td>
                <td>{item.customer_name}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>{item.location}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>{new Date(item.created_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          {[...Array(Math.ceil(dummyData.length / recordsPerPage)).keys()].map(
            (number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </Container>
    </>
  );
};

export default Display;
