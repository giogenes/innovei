import React, { Component } from "react";
import axios from "axios";

class Units extends Component {
  state = {
    test: "HAHA",
    units: [],
  };
  async componentDidMount() {
    console.log("Mounted");
    try {
      const { data } = await axios.get("/api/units?pageSize=10&page=1");
      this.setState({ units: data });
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    console.log(this.state);

    return (
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">PN</th>
              <th scope="col">Serial Number</th>
              <th scope="col">Type</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            {this.state.units.map((unit) => (
              <tr key={unit.id}>
                <td>{unit.unit_type.pn}</td>
                <td>{unit.sn}</td>
                <td>{unit.ticket.ticket_type.name}</td>
                <td>{unit.location.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Units;
