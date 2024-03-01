import React, { useEffect, useState } from "react";
import { Container, Table, Pagination, Form } from "react-bootstrap";

const Display = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const [sortOption, setSortOption] = useState("Sort by");
  const [showdata, setshowdata] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, sortOption]);

  const updateDataForCurrentPage = (allData, page) => {
    setCurrentPage(page)
    const indexOfLastRecord = page * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    let currentRecords = allData.slice(indexOfFirstRecord, indexOfLastRecord);
    setshowdata(currentRecords);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/data?sortby=${sortOption}&searchTerm=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      updateDataForCurrentPage(jsonData, 1);
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleonpage = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateDataForCurrentPage(data, pageNumber);
  };

  return (
    <>
      <Container className="my-4">
        <Form
          className="my-3"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Form.Select
            aria-label="Default select example"
            style={{ width: "30%" }}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Sort by">Default</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
          </Form.Select>
          <Form.Group style={{ width: "30%" }}>
            <Form.Control
              type="text"
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={(e) => setsearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan={2}>SNo</th>
              <th rowSpan={2}>Customer Name</th>
              <th rowSpan={2}>Age</th>
              <th rowSpan={2}>Phone</th>
              <th rowSpan={2}>Location</th>
              <th colSpan="2">Created At</th>
            </tr>
            <tr>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {showdata.map((item, index) => (
              <tr key={index}>
                <td>{item.sno}</td>
                <td>{item.customer_name}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>{item.location}</td>
                <td>{new Date(item.created_at).toLocaleTimeString()}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          {[...Array(Math.ceil(data.length / recordsPerPage)).keys()].map(
            (number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handleonpage(number + 1)}
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
