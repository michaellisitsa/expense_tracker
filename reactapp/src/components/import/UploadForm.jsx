import React from "react";
import styled from "styled-components";
import { useCSVReader } from "react-papaparse";
import parse from "date-fns/parse";
import { parse as OFXParse } from "../../components/import/ofx-js";

function UploadForm({ setUploadedExpenses }) {
  const { CSVReader } = useCSVReader();

  function handleOFXImport(event) {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = (event) => {
      OFXParse(event.target.result)
        .then((ofxData) => {
          setUploadedExpenses({
            status: "success",
            errorMessages: [],
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
        onUploadAccepted={(results) => {
          console.log("---------------------------");
          console.log(results);
          console.log("---------------------------");
          setUploadedExpenses({
            status: results.errors.length === 0 ? "success" : "failure",
            errorMessages: results.errors,
            source: "csv",
            entities: results.data.map((expense) => {
              return {
                id: undefined,
                description: expense[2],
                cost: parseFloat(expense[1]),
                date: parse(expense[0], "dd/MM/yyyy", new Date()),
              };
            }),
          });
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
      <UploaderWrapper>
        <h2>Add OFX File</h2>
        <input type="file" onChange={handleOFXImport} accept=".ofx" />
      </UploaderWrapper>
    </Form>
  );
}

export default UploadForm;

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
