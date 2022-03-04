import React, { useState } from "react";
import styled from "styled-components";
import { useCSVReader } from "react-papaparse";
import { parse, isMatch } from "date-fns";
import { parse as OFXParse } from "../../components/import/ofx-js";
import { observer } from "mobx-react-lite";

function UploadForm({ uploadedExpenses, setUploadedExpenses }) {
  const { CSVReader } = useCSVReader();
  const [error, setError] = useState({ status: false, message: "no error" });
  function handleOFXImport(event) {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = (event) => {
      OFXParse(event.target.result)
        .then((ofxData) => {
          setUploadedExpenses({
            source: "ofx",
            entities:
              ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.map(
                (expense) => {
                  return {
                    id: expense.FITID,
                    description: expense.MEMO,
                    cost: expense.TRNAMT,
                    date: parse(expense.DTUSER, "yyyyMMdd", new Date()),
                  };
                }
              ),
          });
        })
        .catch((error) => {
          setUploadedExpenses({
            status: "failure",
            errorMessages: [error.message],
            source: "ofx",
            entities: [],
          });
        });
    };
    reader.readAsText(event.target.files[0]);
  }

  return (
    <Form>
      <h2>Add CSV File</h2>
      <CSVReader
        config={{ skipEmptyLines: true }}
        // onUploadRejected={}
        onUploadAccepted={(results) => {
          console.log("---------------------------");
          console.log(results);
          console.log("---------------------------");
          // If incorrect number of columns.
          // DONE: If not a valid csv (papaparse returns errors)
          if (results.errors.length !== 0) {
            setError({ status: true, message: "No data returned" });
            return;
          } else if (results.data[0]?.length < 3) {
            setError({
              status: true,
              message:
                "Invalid number of columns. Require at least 3 columns: data | cost | description ",
            });
            return;
          }
          const validatedEntities = results.data.map((expense) => {
            const description = expense[2];
            const cost = parseFloat(expense[1]);
            const dateString = expense[0];
            const valid =
              !isNaN(cost) &&
              isMatch(dateString, "dd/MM/yyyy") &&
              typeof description === "string";
            return {
              id: undefined,
              description,
              cost,
              date: parse(dateString, "dd/MM/yyyy", new Date()),
              valid,
            };
          });
          setUploadedExpenses({
            source: "csv",
            entities: validatedEntities,
          });
          setError({ status: false, message: "" });
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <UploaderWrapper>
            <BrowseFileBtn type="button" {...getRootProps()}>
              Browse file
            </BrowseFileBtn>
            <AcceptedFile>{acceptedFile && acceptedFile.name}</AcceptedFile>
            <RemoveBtn {...getRemoveFileProps()}>Remove</RemoveBtn>
            <ProgressBar
              style={{
                backgroundColor: "red",
              }}
            />
          </UploaderWrapper>
        )}
      </CSVReader>
      <ErrorMessage visible={error.status}>
        <p>{error.message}</p>
      </ErrorMessage>
      <UploaderWrapper>
        <h2>Add OFX File</h2>
        <input type="file" onChange={handleOFXImport} accept=".ofx" />
      </UploaderWrapper>
    </Form>
  );
}

export default observer(UploadForm);

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
`;

const UploaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const BrowseFileBtn = styled.button`
  width: 20%;
`;

const AcceptedFile = styled.div`
  border: 1px solid #ccc;
  height: 45px;
  line-height: 2.5px;
  padding-left: 10px;
  width: 80%;
`;

const RemoveBtn = styled.button`
  border-radius: 0;
  padding: 0 20px;
`;

const ErrorMessage = styled.div`
  display: ${(props) => (props.visible ? "static" : "none")};
  p {
    color: red;
  }
`;
