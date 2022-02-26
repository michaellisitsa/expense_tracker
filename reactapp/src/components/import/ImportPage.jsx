import React from "react";
import CSVUpload from "./CSVUpload";
import OFXUpload from "./OFXUpload";

function ImportPage(props) {
  const [ofxData, setOfxData] = React.useState([]);
  const [csvData, setCsvData] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  return (
    <div>
      <CSVUpload setCsvData={setCsvData} setErrors={setErrors} />
      <OFXUpload setOfxData={setOfxData} setErrors={setErrors} />
      <ol>
        {csvData.length !== 0 &&
          csvData.map((expense, index) => <li key={index}>{expense[2]}</li>)}
        {ofxData.length !== 0 &&
          ofxData.map((expense) => <li key={expense.FITID}>{expense.MEMO}</li>)}
      </ol>
    </div>
  );
}

export default ImportPage;
