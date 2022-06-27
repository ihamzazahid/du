import React from "react";
// import "./MultiSearch.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  MainSearch,
  DisplayArea,
  InputStyled,
  TagComponents,
  TagComponentText,
  TagComponentClose,
} from "./Mig.styled.js";

const TagComponent = (props) => {
  return (
    <div>
      <TagComponents>
        <TagComponentText>{props.text}</TagComponentText>
        <TagComponentClose
          onClick={() => {
            props.cullTagFromTags(props.text);
          }}
        >
          {<CloseCircleOutlined />}
        </TagComponentClose>
      </TagComponents>
    </div>
  );
};

export default TagComponent;
