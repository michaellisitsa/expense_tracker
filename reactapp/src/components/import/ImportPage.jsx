import React from "react";
// import CSVUpload from "./CSVUpload";
// import OFXUpload from "./OFXUpload";
import ImportFilter from "./importFilter";
import UploadForm from "./UploadForm";

function ImportPage(props) {
  const [uploadedExpenses, setUploadedExpenses] = React.useState({
    status: undefined,
    errorMessages: [],
    source: undefined,
    entities: [],
  });

  return (
    <div>
      <UploadForm setUploadedExpenses={setUploadedExpenses} />
      <ImportFilter uploadedExpenses={uploadedExpenses} />
    </div>
  );
}

export default ImportPage;
