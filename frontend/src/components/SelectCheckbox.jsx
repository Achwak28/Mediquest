import React, { useState } from "react";
import { Form, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import Loader from "./Loader";
import { useGetDocumentsQuery } from "../slices/documentApiSlice";

const SelectDropdown = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetDocumentsQuery({
    keyword,
    pageNumber,
  });
  const [summaries, setSummaries] = useState(
    data?.documents.filter((item) => item.category === "summary")
  );
  const [selectYears, setSelectYears] = useState([]);
  const years = [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
    { id: 5, label: "5" },
    { id: 6, label: "6" },
    { id: 7, label: "7" },
  ];

  const yearChange = (event) => {
    const yearId = parseInt(event.target.value);

    const choosen = event.target.checked;

    if (choosen) {
      setSelectYears([...selectYears, yearId]);
      selectYears.map((year) => {
        setSummaries([(data?.documents.filter((item) => item.year === year))])
      })
      console.log(summaries);
    } else {
      setSelectYears(selectYears.filter((id) => id !== yearId));
      setSummaries(summaries.filter((item) => item.year !== yearId ));
      console.log(summaries);
    }
  };

  return (
    <div>
      <Col>
        <h1 style={{ color: "white", marginBottom: "20px" }}>Filters</h1>
        <div className="d-flex justufy-content-end ">
          <h3
            id="multiSelectDropdown"
            sytle={{ marginLeft: "2rem !important" }}
          >
            Year
          </h3>
          <div className="custom-dropdown m-3 pt-1  justify-content-start d-flex">
            <div
              className="custom-dropdown-menu showmx-auto"
              aria-labelledby="multiSelectDropdown"
            >
              {years.map((option) => (
                <Form.Check
                  className="custom-checkbox"
                  key={option.id}
                  type="checkbox"
                  id={`option_${option.id}`}
                  label={option.label}
                  checked={selectYears.includes(option.id)}
                  onChange={yearChange}
                  value={option.id}
                />
              ))}
            </div>
          </div>
        </div>
      </Col>
    </div>
  );
};
export default SelectDropdown;
/*
<div style={{ marginLeft: '20px', width: '50%' }}> 
					<h2>Selected Items:</h2> 
					<ul> 
						{selectYears.map((optionId) => ( 
							<li key={optionId}> 
								{years.find(option => 
									option.id === optionId)?.label} 
							</li> 
						))} 
					</ul> 
				</div> 

*/
