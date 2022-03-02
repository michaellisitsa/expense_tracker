import React from "react";
import ImportFilter from "./ImportFilter";
import UploadForm from "./UploadForm";

function ImportPage(props) {
  const [uploadedExpenses, setUploadedExpenses] = React.useState({
    source: undefined,
    entities: [],
    valid: undefined,
  });

  return (
    <div>
      <UploadForm
        uploadedExpenses={uploadedExpenses}
        setUploadedExpenses={setUploadedExpenses}
      />
      <ImportFilter uploadedExpenses={uploadedExpenses} />
    </div>
  );
}

export default ImportPage;
