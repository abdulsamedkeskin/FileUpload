import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import axios from "axios";
import { useParams } from "react-router";
import { useState } from "react";
import FileDownload from "js-file-download";

const DownloadPage = () => {
  const file_name = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://fileupload.sametkeskin.repl.co/download/${file_name.file_name}`
      )
      .then((res) => setData(res.data))
      .catch((res) => setData(1));
  }, []);
  const download = () => {
    axios({
      url: `https://fileupload.sametkeskin.repl.co/${file_name.file_name}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      FileDownload(response.data, file_name.file_name);
    });
  };

  if (data === 1) {
    return <div>Böyle bir dosya yok.</div>;
  } else {
    return (
      <div
        className="p-d-flex p-ai-center p-flex-wrap"
        style={{ width: "60%", marginLeft: "20%" }}
      >
        <div className="p-d-flex p-ai-center" style={{ width: "40%" }}>
          <span className="p-d-flex p-dir-col p-text-left p-ml-3">
            {data.name}
          </span>
        </div>
        <Tag value={data.size} severity="warning" className="p-px-3 p-py-2" />
        <Button
          type="button"
          icon="pi pi-download"
          className="p-button-outlined p-button-rounded p-button-primary p-ml-auto"
          onClick={download}
        />
      </div>
    );
  }
};

export default DownloadPage;
