import React, { Component } from "react";
import { connect } from "react-redux";
import RoverCard from "./RoverCard";
import RoverShow from "./RoverShow";
import "./RoversContainer.css";

class RoversContainer extends Component {

  revealShow = (e) => {
    // console.log(e.target.attributes.roverid.value)
  }

  displayRovers = () => {
    if (this.props.loading) {
      return `Loading...`
    } else {
      return (
        this.props.rovers.all.map((rover) => (
          <div className="RoverContainer" id={`RoverContainer-${rover.id}`} key={`RoverContainer-${rover.id}`}>
            {[
              < RoverCard
                { ...rover }
                key={`RoverCard${rover.external_id}`}
                revealShow={this.revealShow}
              />,
              < RoverShow { ...rover } key={`RoverShow${rover.external_id}`} />
            ]}
          </div>
        ))
      );
    }
  };

  render() {
    return (
      <div className="RoversContainer" id="RoversContainer">
        { this.displayRovers() }
      </div>
    );
  };

};

const mapStateToProps = (state) => ({ rovers: state.rovers });

export default connect(mapStateToProps)(RoversContainer);