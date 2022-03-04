import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../store/helpers/use-store";
import ImportFilter from "./ImportFilter";
import UploadForm from "./UploadForm";

function ImportPage(props) {
  const { categoriesStore } = useStore();

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
      <ImportFilter
        categoriesStore={categoriesStore}
        uploadedExpenses={uploadedExpenses}
      />
    </div>
  );
}

export default observer(ImportPage);
