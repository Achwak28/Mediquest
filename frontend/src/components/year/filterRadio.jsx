import "./filterRadio.css";
import Input from "../../components/Input";

function Year({ handleChange }) {
  return (
    <div className="ml-3" style={{margin: "auto"}}>
      <h2 className="sidebar-title">Year</h2>

      <div className="ml-3" style={{margin: "auto"}}>
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="test" />
          <span className="checkmark"></span>All
        </label>
        <Input
          handleChange={handleChange}
          value="1"
          title="1"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="2"
          title="2"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="3"
          title="3"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="4"
          title="4"
          name="test"
        />
        
        <Input
          handleChange={handleChange}
          value="5"
          title="5"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="6"
          title="6"
          name="test"
        />
      </div>
    </div>
  );
}

export default Year;