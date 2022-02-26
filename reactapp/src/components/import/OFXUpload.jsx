import React from "react";
import { parse } from "../../components/import/ofx-js";

function OFXUpload({ setOfxData, setError }) {
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
    <form>
      <input type="file" onChange={handleOFXImport} accept=".ofx" />
    </form>
  );
}

export default OFXUpload;
