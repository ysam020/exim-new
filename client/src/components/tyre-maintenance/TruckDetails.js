import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Container, Row, Col } from "react-bootstrap";

function TruckDetails() {
  const [truckNo, setTruckNo] = useState("");
  const [data, setData] = useState();

  async function getData() {
    if (!truckNo) return;
    const res = await axios(
      `${process.env.REACT_APP_API_STRING}/get-truck-details/${truckNo}`
    );
    if (res.data.message === "Tyre does not exist") {
      return alert(res.data.message);
    } else {
      setData(res.data);
    }
  }

  return (
    <div>
      <TextField
        size="small"
        id="outlined-basic"
        label="Enter truck number"
        variant="outlined"
        onChange={(e) => setTruckNo(e.target.value)}
      />

      <button
        onClick={getData}
        className="btn"
        style={{ marginTop: 0, marginLeft: "15px" }}
      >
        Search
      </button>

      <Container>
        <Row>
          {data && (
            <>
              {data.tyres.map((tyre) => {
                return (
                  <Col lg={3} xs={12} key={tyre._id}>
                    <p>
                      <strong>Tyre Number:&nbsp;</strong>
                      {tyre.tyre_no}
                    </p>
                    <p>
                      <strong>Location:&nbsp;</strong>
                      {tyre.location}
                    </p>
                    <p>
                      <strong>Fitting Date:&nbsp;</strong>
                      {tyre.fitting_date}
                    </p>
                    <p>
                      <strong>Fitting Date Odometer:&nbsp;</strong>
                      {tyre.fitting_date_odometer}
                    </p>
                  </Col>
                );
              })}
            </>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default TruckDetails;
