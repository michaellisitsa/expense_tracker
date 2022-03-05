import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../store/helpers/use-store";
import ImportFilter from "./ImportFilter";
import UploadForm from "./UploadForm";

function ImportPage(props) {
  const { categoriesStore, importedExpensesStore } = useStore();

  return (
    <div>
      <UploadForm importedExpensesStore={importedExpensesStore} />
      <ImportFilter
        importedExpensesStore={importedExpensesStore}
        categoriesStore={categoriesStore}
      />
    </div>
  );
}

export default observer(ImportPage);
