import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import axios from "axios";

const UploadPage = () => {
  const [totalSize, setTotalSize] = useState(0);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState(null);
  const [copyMessage, setCopyMessage] = useState("Copy Link");
  const toast = useRef(null);
  const fileUploadRef = useRef(null);

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    _totalSize += e.files[0].size;
    setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    setProgress(0);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        <ProgressBar
          value={progress}
          displayValueTemplate={() => `%${progress}`}
          style={{ width: "300px", height: "20px", marginLeft: "auto" }}
        />
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="p-d-flex p-ai-center p-flex-wrap">
        <div className="p-d-flex p-ai-center" style={{ width: "40%" }}>
          <span className="p-d-flex p-dir-col p-text-left p-ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="p-px-3 p-py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger p-ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="p-d-flex p-ai-center p-dir-col">
        <i
          className="pi pi-file p-mt-3 p-p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="p-my-5"
        >
          Drag and Drop File Here
        </span>
      </div>
    );
  };
  const handleUpload = (e) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    };
    const formData = new FormData();
    formData.append("file", e.files[0]);
    axios
      .post("https://fileupload.sametkeskin.repl.co/upload", formData, config)
      .then(
        (res) => (
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "File Uploaded",
          }),
          setLink(res.data.url)
        )
      )
      .catch((err) =>
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: String(err),
        })
      );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />

      <div className="card">
        <FileUpload
          ref={fileUploadRef}
          name="files"
          url="https://fileupload.sametkeskin.repl.co/upload"
          auto={true}
          customUpload
          uploadHandler={handleUpload}
          accept="*"
          maxFileSize={10000000}
          onSelect={onTemplateSelect}
          onError={onTemplateClear}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
        />
        {link ? (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.href}download/${
                  link.split("https://fileupload.sametkeskin.repl.co/")[1]
                }`
              );
              setCopyMessage("Link Copied!");
            }}
            style={{ marginLeft: "40%", marginTop: "2%" }}
          >
            {copyMessage}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default UploadPage;
