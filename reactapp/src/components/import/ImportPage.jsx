import React from "react";
import { useCSVReader } from "react-papaparse";
import { parse } from "../../components/import/ofx-js";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

function ImportPage(props) {
  const [csvData, setCsvData] = React.useState([]);
  const [ofxData, setOfxData] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const { CSVReader } = useCSVReader();

  function handleOFXImport(event) {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = (event) => {
      parse(event.target.result).then((ofxData) => {
        setOfxData(
          ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
        );
      });
    };
    reader.readAsText(event.target.files[0]);
  }

  return (
    <div>
      {" "}
      <CSVReader
        onUploadAccepted={(results) => {
          console.log("---------------------------");
          console.log(results);
          console.log("---------------------------");
          setCsvData(results.data);
          setErrors(results.errors);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <div>
            <div>
              <div style={styles.csvReader}>
                <button
                  type="button"
                  {...getRootProps()}
                  style={styles.browseFile}
                >
                  Browse file
                </button>
                <div style={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} style={styles.remove}>
                  Remove
                </button>
              </div>
              <ProgressBar style={styles.progressBarBackgroundColor} />
            </div>
            <form>
              <input type="file" onChange={handleOFXImport} accept=".ofx" />
            </form>
            <ol>
              {csvData.map((expense, index) => (
                <li key={index}>{expense[2]}</li>
              ))}
            </ol>
          </div>
        )}
      </CSVReader>
    </div>
  );
}

export default ImportPage;
