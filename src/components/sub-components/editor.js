import React from "react";
import { Editor } from "@tinymce/tinymce-react";
const TextEditor = (props) => {
  const { handler, value } = props;
  return (
    <Editor
      apiKey="42qc6w6ymzy0p4ptj9p0ol3xj8y6amagydkd9lpzshlpf7ns"
      initialValue="<p>This is the initial content of the editor</p>"
      init={{
        height: 200,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        external_plugins: {
          tiny_mce_wiris:
            "https://www.wiris.net/demo/plugins/tiny_mce/plugin.js",
        },
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",
      }}
      onEditorChange={handler}
      onFocus={props.focus}
      onBlur={props.blur}
      value={value}
    />
  );
};

export default TextEditor;
